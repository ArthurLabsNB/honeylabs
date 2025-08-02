/** /app/api/login/route.ts
 *  Ruta de login / sesión – Supabase-only
 */
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@lib/db'                         // crea cliente Supabase con SERVICE_ROLE
import type { SupabaseClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  SESSION_COOKIE,
  sessionCookieOptions
} from '@lib/constants'
import { getUsuarioFromSession } from '@lib/auth'
import { verifyRecaptcha } from '@lib/recaptcha'
import * as logger from '@lib/logger'

/* ──────────────── CONSTANTES ──────────────── */
const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_EXPIRES = 60 * 60 * 24 * 7 // 7 días

/* ────────────────── POST /login ────────────────── */
export async function POST (req: NextRequest) {
  try {
    const { correo, contrasena, captchaToken } = await req.json()

    /* 1. Validaciones */
    const email = (correo ?? '').toString().toLowerCase().trim()
    if (!email || !contrasena) {
      return jsonError('Correo y contraseña requeridos', 400)
    }
    if (!(await verifyRecaptcha(captchaToken))) {
      return jsonError('Captcha inválido', 400)
    }

    /* 2. Obtener usuario */
    const db = getDb().client as SupabaseClient
    const { data: usuario, error } = await db
      .from('usuario')
      .select(`
        id, nombre, correo, contrasena, tipo_cuenta, estado,
        entidad ( id, nombre, tipo, plan_id ),
        roles:_RolToUsuario (
          rol:Rol ( id, nombre, descripcion, permisos )
        )
      `)
      .ilike('correo', email)
      .limit(1)
      .maybeSingle()

    if (error) {
      logger.error('[LOGIN_DB]', { error })
      return jsonError('Error de base de datos', 500)
    }
    if (!usuario) {
      logger.warn('[LOGIN] Usuario no encontrado o sin join', { email })
      return jsonError('Credenciales inválidas', 401)
    }
    const ok = await bcrypt.compare(contrasena, usuario.contrasena ?? '')
    if (!ok) {
      logger.warn('[LOGIN] Password mismatch', { id: usuario.id })
      return jsonError('Credenciales inválidas', 401)
    }
    if ((usuario.estado ?? 'activo') !== 'activo') {
      return jsonError('Cuenta suspendida o pendiente', 403)
    }

    /* 3. Payload & roles */
    const roles = (usuario.roles ?? []).map(({ rol }) => ({
      id: rol.id,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      permisos: parseJson(rol.permisos),
    }))

    const { data: susActiva } = await db
      .from('suscripcion')
      .select(`
        id, fecha_fin,
        plan:plan_id ( nombre, limites )
      `)
      .eq('usuario_id', usuario.id)
      .eq('activo', true)
      .maybeSingle()

    const plan =
      susActiva && susActiva.plan
        ? {
            id: susActiva.id,
            plan: susActiva.plan.nombre,
            limites: parseJson(susActiva.plan.limites),
            fechaFin: susActiva.fecha_fin,
          }
        : null

    /* 4. Crear sesión */
    const { data: sesion } = await db
      .from('sesion_usuario')
      .insert({
        usuario_id: usuario.id,
        user_agent: req.headers.get('user-agent') ?? null,
        ip:
          req.headers.get('x-real-ip') ??
          req.headers.get('x-forwarded-for') ??
          null,
      })
      .select('id')
      .single()

    /* 5. Firmar JWT + cookie */
    const token = jwt.sign(
      { id: usuario.id, sid: sesion.id },
      JWT_SECRET,
      { expiresIn: COOKIE_EXPIRES },
    )

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      esSuperAdmin: false,
      tipoCuenta: usuario.tipo_cuenta,
      entidad: usuario.entidad,
      roles,
      plan,
    }

    const res = NextResponse.json({ success: true, usuario: payload })
    res.cookies.set(SESSION_COOKIE, token, {
      ...sessionCookieOptions,
      maxAge: COOKIE_EXPIRES,
    })
    return res
  } catch (err) {
    logger.error('[LOGIN_ERROR]', err)
    return jsonError('Error interno', 500)
  }
}

/* ──────────────── GET /login ──────────────── */
export async function GET () {
  try {
    const usuario = await getUsuarioFromSession({ cookies: await cookies() })
    if (!usuario) return jsonError('No autenticado', 401)
    return NextResponse.json({ success: true, usuario })
  } catch (err) {
    logger.error('[SESSION_ERROR]', err)
    return jsonError('Error interno', 500)
  }
}

/* ──────────────── DELETE /login ──────────────── */
export async function DELETE () {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    try {
      const { sid } = jwt.verify(token, JWT_SECRET) as { sid?: number }
      if (sid) {
        const db = getDb().client as SupabaseClient
        await db
          .from('sesion_usuario')
          .update({ activa: false, fecha_ultima: new Date().toISOString() })
          .eq('id', sid)
      }
    } catch (e) { /* token inválido o expirado */ }
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, '', {
    ...sessionCookieOptions,
    expires: new Date(0),
    maxAge: 0,
  })
  return res
}

/* ───────────────── helpers ───────────────── */
function jsonError (msg: string, status: number) {
  return NextResponse.json({ success: false, error: msg }, { status })
}
function parseJson (v: any) {
  try { return typeof v === 'string' ? JSON.parse(v) : v ?? {} }
  catch { return {} }
}
