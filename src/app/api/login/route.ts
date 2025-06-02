// src/app/api/login/route.ts

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- PRISMA GLOBAL SAFE ---
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- CONFIGURACIÓN SEGURA ---
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en variables de entorno');
}
const COOKIE_NAME = 'hl_session';
const COOKIE_EXPIRES = 60 * 60 * 24 * 7; // 7 días en segundos

// Utilidad: obtiene plan activo y límites del usuario o entidad
async function obtenerPlanYLimites(usuario: any) {
  // Prioridad: plan de usuario
  if (usuario.planId) {
    const plan = await prisma.plan.findUnique({ where: { id: usuario.planId } });
    if (plan) {
      return {
        tipo: 'usuario',
        nombre: plan.nombre,
        limites: plan.limites ? JSON.parse(plan.limites) : {},
        id: plan.id,
      };
    }
  }
  // Si no, plan de entidad si aplica
  if (usuario.entidadId) {
    const entidad = await prisma.entidad.findUnique({
      where: { id: usuario.entidadId },
      include: { plan: true },
    });
    if (entidad?.plan) {
      return {
        tipo: 'entidad',
        nombre: entidad.plan.nombre,
        limites: entidad.plan.limites ? JSON.parse(entidad.plan.limites) : {},
        id: entidad.plan.id,
      };
    }
  }
  return null; // Sin plan explícito
}

// ---- POST: Login ----
export async function POST(req: NextRequest) {
  try {
    const { correo, contrasena } = await req.json();

    if (!correo || !contrasena) {
      return NextResponse.json(
        { success: false, error: 'Correo y contraseña requeridos.' },
        { status: 400 }
      );
    }

    // Busca usuario con relaciones necesarias
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

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordOk) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    if ((usuario.estado ?? 'activo') !== 'activo') {
      return NextResponse.json(
        { success: false, error: 'Tu cuenta no está validada o ha sido suspendida.' },
        { status: 403 }
      );
    }

    // Obtiene plan activo y límites
    const planActivo = await obtenerPlanYLimites(usuario);

    // Extrae roles en formato limpio y parsea permisos JSON
    const roles = (usuario.roles ?? []).map((r: any) => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      permisos: r.permisos ? JSON.parse(r.permisos) : {},
    }));

    // Extrae suscripción activa si existe
    const suscripcionActiva = usuario.suscripciones?.length > 0
      ? {
          id: usuario.suscripciones[0].id,
          plan: usuario.suscripciones[0].plan?.nombre,
          limites: usuario.suscripciones[0].plan?.limites
            ? JSON.parse(usuario.suscripciones[0].plan.limites)
            : {},
          fechaFin: usuario.suscripciones[0].fechaFin,
        }
      : null;

    // Payload para JWT (sin contraseña ni datos sensibles)
    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      tipoCuenta: usuario.tipoCuenta,
      estado: usuario.estado,
      entidadId: usuario.entidadId,
      entidad: usuario.entidad ? {
        id: usuario.entidad.id,
        nombre: usuario.entidad.nombre,
        tipo: usuario.entidad.tipo,
        planId: usuario.entidad.planId,
      } : null,
      roles,
      plan: planActivo,
      suscripcion: suscripcionActiva,
    };

    // Firma JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: COOKIE_EXPIRES });

    // Respuesta con cookie httpOnly
    const res = NextResponse.json(
      { success: true, mensaje: 'Inicio de sesión exitoso.', usuario: payload },
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
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

// ---- GET: Verificar sesión ----
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No estás autenticado.' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return NextResponse.json(
        { success: true, usuario: decoded },
        { status: 200 }
      );
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Sesión inválida o expirada.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('[ERROR_GET_SESSION]', error);
    return NextResponse.json(
      { success: false, error: 'Error al verificar la sesión.' },
      { status: 500 }
    );
  }
}

// ---- DELETE: Cerrar sesión ----
export async function DELETE(req: NextRequest) {
  try {
    const res = NextResponse.json(
      { success: true, mensaje: 'Sesión cerrada exitosamente.' },
      { status: 200 }
    );
    res.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      maxAge: 0,
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('[ERROR_LOGOUT]', error);
    return NextResponse.json(
      { success: false, error: 'Error al cerrar sesión.' },
      { status: 500 }
    );
  }
}
