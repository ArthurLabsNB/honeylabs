export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Prisma singleton
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET ?? 'mi_clave_de_emergencia';
const COOKIE_NAME = 'hl_session';
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

    const usuario = await prisma.usuario.findUnique({
      where: { correo: correo.toLowerCase().trim() },
      include: {
        entidad: { select: { id: true, nombre: true, tipo: true, planId: true } },
        roles: { select: { id: true, nombre: true, descripcion: true, permisos: true } },
        suscripciones: {
          where: { activo: true },
          select: { id: true, plan: { select: { nombre: true, limites: true } }, fechaFin: true },
        },
      },
    });

    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas.' },
        { status: 401 }
      );
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
      permisos: r.permisos ? JSON.parse(r.permisos) : {},
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

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_EXPIRES,
      path: '/',
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
    const token = req.cookies.get(COOKIE_NAME)?.value;
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
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    maxAge: 0,
    path: '/',
  });
  return res;
}
