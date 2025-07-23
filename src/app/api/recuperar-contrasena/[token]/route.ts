export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { respuestaError } from '@lib/http';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido');
}

function getToken(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.findIndex((p) => p === 'recuperar-contrasena');
  return idx !== -1 && parts.length > idx + 1 ? parts[idx + 1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) return respuestaError('Token inválido', '', 400);
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
      if (payload.tipo !== 'reset') throw new Error('tipo');
    } catch {
      return respuestaError('Token inválido o expirado', '', 400);
    }
    const { contrasena } = await req.json();
    if (!contrasena || contrasena.length < 6) {
      return respuestaError('Contraseña insegura', '', 400);
    }
    const hash = await bcrypt.hash(contrasena, 10);
    await prisma.usuario.update({ where: { id: payload.id }, data: { contrasena: hash } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return respuestaError('Error interno', error.message, 500);
  }
}
