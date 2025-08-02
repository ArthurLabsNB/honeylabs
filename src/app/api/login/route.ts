export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { SESSION_COOKIE, sessionCookieOptions } from '@lib/constants'
import { getUsuarioFromSession } from '@lib/auth'
import { verifyRecaptcha } from '@lib/recaptcha'
import * as logger from '@lib/logger'


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en el entorno');
}
const COOKIE_EXPIRES = 60 * 60 * 24 * 7; // 7 días

// POST Login
export async function POST(req: NextRequest) {
  try {
    const { correo, contrasena, captchaToken } = await req.json();
    const correoStr =
      typeof correo === 'string' ? correo.toLowerCase().trim() : '';
    const contrasenaStr =
      typeof contrasena === 'string' ? contrasena : '';
    if (!(await verifyRecaptcha(captchaToken))) {
      return NextResponse.json(
        { success: false, error: 'Captcha inválido.' },
        { status: 400 },
      );
    }
    if (!correoStr || !contrasenaStr) {
      return NextResponse.json(
        { success: false, error: 'Correo y contraseña requeridos.' },
        { status: 400 },
      );
    }

    if (process.env.DB_PROVIDER === 'prisma') {
      const { prisma } = await import('@lib/db/prisma')
      let usuario = await prisma.usuario.findUnique({
        where: { correo: correoStr },
        select: {
          id: true,
          nombre: true,
          correo: true,
          contrasena: true,
          tipoCuenta: true,
          estado: true,
          entidad: { select: { id: true, nombre: true, tipo: true, planId: true } },
          roles: { select: { id: true, nombre: true, descripcion: true, permisos: true } },
          suscripciones: {
            where: { activo: true },
            select: {
              id: true,
              plan: { select: { nombre: true, limites: true } },
              fechaFin: true,
            },
          },
        },
      })

      if (!usuario || !(await bcrypt.compare(contrasenaStr, usuario.contrasena))) {
        return NextResponse.json(
          { success: false, error: 'Credenciales inválidas.' },
          { status: 401 }
        )
      }

      // Actualizar datos legacy si existen
      const updates: any = {}
      if (usuario.tipoCuenta === 'estandar') {
        updates.tipoCuenta = 'individual'
        usuario.tipoCuenta = 'individual'
      }
      if (usuario.tipoCuenta === 'administrador') {
        updates.tipoCuenta = 'admin'
        usuario.tipoCuenta = 'admin'
      }
      const roles: { id: number; nombre: string; descripcion: string | null; permisos: any }[] = []
      for (const r of usuario.roles) {
        let perms = r.permisos as any
        if (typeof perms === 'string') {
          try {
            perms = JSON.parse(perms)
            await prisma.rol.update({ where: { id: r.id }, data: { permisos: perms } })
          } catch {
            perms = {}
          }
        }
        roles.push({ id: r.id, nombre: r.nombre, descripcion: r.descripcion, permisos: perms || {} })
      }
      if (Object.keys(updates).length > 0) {
        await prisma.usuario.update({ where: { id: usuario.id }, data: updates })
      }

      if ((usuario.estado ?? 'activo') !== 'activo') {
        return NextResponse.json(
          { success: false, error: 'Cuenta suspendida o pendiente.' },
          { status: 403 }
        )
      }

      const suscripcionActiva = usuario.suscripciones[0]
        ? {
            id: usuario.suscripciones[0].id,
            plan: usuario.suscripciones[0].plan?.nombre,
            limites: usuario.suscripciones[0].plan?.limites
              ? JSON.parse(usuario.suscripciones[0].plan.limites)
              : {},
            fechaFin: usuario.suscripciones[0].fechaFin,
          }
        : null

      const session = await prisma.sesionUsuario.create({
        data: {
          usuarioId: usuario.id,
          userAgent: req.headers.get('user-agent') || null,
          ip:
            req.headers.get('x-real-ip') ||
            req.headers.get('x-forwarded-for') ||
            null,
        },
      })

      const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        esSuperAdmin: false,
        tipoCuenta: usuario.tipoCuenta,
        entidad: usuario.entidad,
        roles,
        plan: suscripcionActiva,
      }

      const token = jwt.sign({ id: usuario.id, sid: session.id }, JWT_SECRET, {
        expiresIn: COOKIE_EXPIRES,
      })

      const res = NextResponse.json(
        { success: true, usuario: payload },
        { status: 200 }
      )

      res.cookies.set(SESSION_COOKIE, token, {
        ...sessionCookieOptions,
        maxAge: COOKIE_EXPIRES,
      })

      return res
    }

    const db = getDb().client as SupabaseClient
    const { data: usuario, error } = await db
      .from('Usuario')
      .select(
        `id,nombre,correo,contrasena,tipoCuenta,estado,entidad:entidadId(id,nombre,tipo,planId),roles:rol(id,nombre,descripcion,permisos,_RolToUsuario!inner(usuarioId)),suscripciones:suscripcion(id,plan:planId(nombre,limites),fechaFin,activo)`
      )
      .eq('correo', correoStr)
      .maybeSingle()
    if (error) {
      logger.error('[LOGIN_DB_ERROR]', error)
      return NextResponse.json(
        { success: false, error: 'Error de base de datos.' },
        { status: 500 }
      )
    }
    if (!usuario || !(await bcrypt.compare(contrasenaStr, usuario.contrasena))) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas.' },
        { status: 401 }
      )
    }

    if ((usuario.estado ?? 'activo') !== 'activo') {
      return NextResponse.json(
        { success: false, error: 'Cuenta suspendida o pendiente.' },
        { status: 403 }
      )
    }

    const roles: { id: number; nombre: string; descripcion: string | null; permisos: any }[] = []
    for (const r of usuario.roles ?? []) {
      let perms: any = r.permisos
      if (typeof perms === 'string') {
        try {
          perms = JSON.parse(perms)
        } catch {
          perms = {}
        }
      }
      roles.push({ id: r.id, nombre: r.nombre, descripcion: r.descripcion, permisos: perms || {} })
    }

    const susActiva = (usuario.suscripciones ?? []).find((s: any) => s.activo)
    const suscripcionActiva = susActiva
      ? {
          id: susActiva.id,
          plan: susActiva.plan?.nombre,
          limites: susActiva.plan?.limites
            ? JSON.parse(susActiva.plan.limites)
            : {},
          fechaFin: susActiva.fechaFin,
        }
      : null

    const { data: session } = await db
      .from('SesionUsuario')
      .insert({
        usuarioId: usuario.id,
        userAgent: req.headers.get('user-agent') || null,
        ip:
          req.headers.get('x-real-ip') ||
          req.headers.get('x-forwarded-for') ||
          null,
      })
      .select('id')
      .single()

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      esSuperAdmin: false,
      tipoCuenta: usuario.tipoCuenta,
      entidad: usuario.entidad,
      roles,
      plan: suscripcionActiva,
    }

    const token = jwt.sign({ id: usuario.id, sid: session.id }, JWT_SECRET, {
      expiresIn: COOKIE_EXPIRES,
    })

    const res = NextResponse.json(
      { success: true, usuario: payload },
      { status: 200 }
    )

    res.cookies.set(SESSION_COOKIE, token, {
      ...sessionCookieOptions,
      maxAge: COOKIE_EXPIRES,
    })

    return res
  } catch (error) {
    if (process.env.DB_PROVIDER === 'prisma') {
      const { Prisma } = await import('@prisma/client')
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2021'
      ) {
        logger.error('[ERROR_LOGIN_DB]', error)
        return NextResponse.json(
          { success: false, error: 'Base de datos no inicializada.' },
          { status: 500 },
        )
      }
    }
    logger.error('[ERROR_LOGIN]', error)
    return NextResponse.json(
      { success: false, error: 'Error interno.' },
      { status: 500 },
    )
  }
}

// GET verificar sesión
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const usuario = await getUsuarioFromSession({ cookies: cookieStore })
    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'No autenticado.' },
        { status: 401 },
      )
    }
    return NextResponse.json({ success: true, usuario }, { status: 200 })
  } catch (error) {
    logger.error('[ERROR_GET_SESSION]', error)
    return NextResponse.json({ success: false, error: 'Error interno.' }, { status: 500 })
  }
}

// DELETE Logout
export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { sid?: number }
      if (decoded.sid) {
        if (process.env.DB_PROVIDER === 'prisma') {
          const { prisma } = await import('@lib/db/prisma')
          await prisma.sesionUsuario.update({
            where: { id: decoded.sid },
            data: { activa: false, fechaUltima: new Date() },
          })
        } else {
          const db = getDb().client as SupabaseClient
          await db
            .from('SesionUsuario')
            .update({ activa: false, fechaUltima: new Date().toISOString() })
            .eq('id', decoded.sid)
        }
      }
    } catch {}
  }
  const res = NextResponse.json({ success: true }, { status: 200 })
  res.cookies.set(SESSION_COOKIE, '', {
    ...sessionCookieOptions,
    expires: new Date(0),
    maxAge: 0,
  })
  return res
}
