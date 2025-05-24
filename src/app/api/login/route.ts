// Forzar ejecución en entorno Node.js (no Edge)
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { correo, contrasena } = await req.json();

    if (!correo || !contrasena) {
      return NextResponse.json({ error: 'Correo y contraseña requeridos.' }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({ where: { correo } });

    if (!usuario) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    }

    const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordOk) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    }

    if (usuario.estado !== 'activo') {
      return NextResponse.json({ error: 'Tu cuenta no está validada o ha sido suspendida.' }, { status: 403 });
    }

    // ✅ Todo OK — Devolver datos seguros (sin contraseña)
    return NextResponse.json({
      success: true,
      mensaje: 'Inicio de sesión exitoso.',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        tipoCuenta: usuario.tipoCuenta,
        estado: usuario.estado,
        entidadId: usuario.entidadId,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('[ERROR_LOGIN]', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
