export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SESSION_COOKIE, sessionCookieOptions } from '@lib/constants';


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en el entorno');
}
const COOKIE_EXPIRES = 60 * 60 * 24 * 7; // 7 días

// POST Login
export async function POST(req: NextRequest) {
  try {
    const { correo, contrasena } = await req.json();
    if (!correo || !contrasena) {
      return NextResponse.json(
        { success: false, error: 'Correo y contraseña requeridos.' },
        { status: 400 }
      );
    }

    let usuario = await prisma.usuario.findUnique({
      where: { correo: correo.toLowerCase().trim() },
      include: {
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
    });

    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Actualizar datos legacy si existen
    const updates: any = {};
    if (usuario.tipoCuenta === 'estandar') {
      updates.tipoCuenta = 'individual';
      usuario.tipoCuenta = 'individual';
    }
    const roles: { id: number; nombre: string; descripcion: string | null; permisos: any }[] = [];
    for (const r of usuario.roles) {
      let perms = r.permisos as any;
      if (typeof perms === 'string') {
        try {
          perms = JSON.parse(perms);
          await prisma.rol.update({ where: { id: r.id }, data: { permisos: perms } });
        } catch {
          perms = {};
        }
      }
      roles.push({ id: r.id, nombre: r.nombre, descripcion: r.descripcion, permisos: perms || {} });
    }
    if (Object.keys(updates).length > 0) {
      await prisma.usuario.update({ where: { id: usuario.id }, data: updates });
    }

    if ((usuario.estado ?? 'activo') !== 'activo') {
      return NextResponse.json(
        { success: false, error: 'Cuenta suspendida o pendiente.' },
        { status: 403 }
      );
    }


    const roles = usuario.roles.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      permisos: (r.permisos as any) || {},
    }));

    const suscripcionActiva = usuario.suscripciones[0]
      ? {
          id: usuario.suscripciones[0].id,
          plan: usuario.suscripciones[0].plan?.nombre,
          limites: usuario.suscripciones[0].plan?.limites
            ? JSON.parse(usuario.suscripciones[0].plan.limites)
            : {},
          fechaFin: usuario.suscripciones[0].fechaFin,
        }
      : null;

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      esSuperAdmin: usuario.esSuperAdmin ?? false,
      tipoCuenta: usuario.tipoCuenta,
      entidad: usuario.entidad,
      roles,
      plan: suscripcionActiva,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: COOKIE_EXPIRES });

    const res = NextResponse.json(
      { success: true, usuario: payload },
      { status: 200 }
    );

    res.cookies.set(SESSION_COOKIE, token, {
      ...sessionCookieOptions,
      maxAge: COOKIE_EXPIRES,
    });

    return res;
  } catch (error) {
    console.error('[ERROR_LOGIN]', error);
    return NextResponse.json({ success: false, error: 'Error interno.' }, { status: 500 });
  }
}

// GET verificar sesión
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'No autenticado.' }, { status: 401 });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return NextResponse.json({ success: true, usuario: decoded }, { status: 200 });
    } catch {
      return NextResponse.json({ success: false, error: 'Sesión expirada.' }, { status: 401 });
    }
  } catch (error) {
    console.error('[ERROR_GET_SESSION]', error);
    return NextResponse.json({ success: false, error: 'Error interno.' }, { status: 500 });
  }
}

// DELETE Logout
export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set(SESSION_COOKIE, '', {
    ...sessionCookieOptions,
    expires: new Date(0),
    maxAge: 0,
  });
  return res;
}
