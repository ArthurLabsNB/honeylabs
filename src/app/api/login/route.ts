export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// === PRISMA SAFE SINGLETON ===
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// === CONFIGURACIÓN SEGURA ===
const JWT_SECRET = process.env.JWT_SECRET ?? 'mi_clave_de_emergencia'; // ¡Cambia en producción!
const COOKIE_NAME = 'hl_session';
const COOKIE_EXPIRES = 60 * 60 * 24 * 7; // 7 días en segundos

// ---- POST: Login ----
export async function POST(req: NextRequest) {
  try {
    const { correo, contrasena } = await req.json();

    // Validación básica
    if (!correo || !contrasena) {
      return NextResponse.json(
        { success: false, error: 'Correo y contraseña requeridos.' },
        { status: 400 }
      );
    }

    // Busca usuario (puedes personalizar los selects)
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
      // Mensaje genérico para evitar enumeración
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Validar contraseña (bcrypt compara hash)
    const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordOk) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Checa estado de cuenta
    if ((usuario.estado ?? 'activo') !== 'activo') {
      return NextResponse.json(
        { success: false, error: 'Tu cuenta no está validada o ha sido suspendida.' },
        { status: 403 }
      );
    }

    // Normaliza datos de roles y plan (según tu modelo)
    const roles = (usuario.roles ?? []).map((r: any) => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      permisos: r.permisos ? JSON.parse(r.permisos) : {},
    }));

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

    // Payload para JWT (nunca pongas datos sensibles)
    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      tipoCuenta: usuario.tipoCuenta,
      estado: usuario.estado,
      entidadId: usuario.entidadId,
      entidad: usuario.entidad
        ? {
            id: usuario.entidad.id,
            nombre: usuario.entidad.nombre,
            tipo: usuario.entidad.tipo,
            planId: usuario.entidad.planId,
          }
        : null,
      roles,
      plan: suscripcionActiva, // O tu lógica personalizada
    };

    // Generar JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: COOKIE_EXPIRES });

    // Set cookie segura
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
      // Token inválido o expirado
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

    // Elimina la cookie del cliente
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
