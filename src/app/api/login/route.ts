// Forzar ejecución en entorno Node.js (no Edge)
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Validación de body
    const { correo, contrasena } = await req.json();

    if (!correo || !contrasena) {
      return NextResponse.json(
        { error: 'Correo y contraseña requeridos.' },
        { status: 400 }
      );
    }

    // Busca usuario (devuelve siempre el mismo mensaje en error para evitar enumeración)
    const usuario = await prisma.usuario.findUnique({
      where: { correo: correo.toLowerCase().trim() },
    });

    if (!usuario) {
      // No revelar si existe o no el usuario
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Validar contraseña
    const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordOk) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Estado del usuario (ejemplo: activo, suspendido, pendiente)
    if (usuario.estado !== 'activo') {
      return NextResponse.json(
        { error: 'Tu cuenta no está validada o ha sido suspendida.' },
        { status: 403 }
      );
    }

    // // Si quieres setear una cookie de sesión, usa Response en vez de NextResponse.json
    // const res = NextResponse.json({
    //   success: true,
    //   mensaje: 'Inicio de sesión exitoso.',
    //   usuario: {
    //     id: usuario.id,
    //     nombre: usuario.nombre,
    //     tipoCuenta: usuario.tipoCuenta,
    //     estado: usuario.estado,
    //     entidadId: usuario.entidadId,
    //   }
    // }, { status: 200 });
    // res.cookies.set('token', generateJWT(usuario), { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
    // return res;

    // No enviar jamás contraseña ni datos sensibles
    return NextResponse.json(
      {
        success: true,
        mensaje: 'Inicio de sesión exitoso.',
        // Devuelve SOLO datos públicos y necesarios
        id: usuario.id,
        nombre: usuario.nombre,
        tipoCuenta: usuario.tipoCuenta,
        correo: usuario.correo,
        estado: usuario.estado,
        entidadId: usuario.entidadId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ERROR_LOGIN]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
