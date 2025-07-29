export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import jwt from 'jsonwebtoken';
import { enviarCorreoResetContrasena } from '@/lib/email/enviarResetContrasena';
import { respuestaError } from '@lib/http';
import { verifyRecaptcha } from '@lib/recaptcha';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido');
}

export async function POST(req: NextRequest) {
  try {
    const { correo, captchaToken } = await req.json();
    if (!(await verifyRecaptcha(captchaToken))) {
      return respuestaError('Captcha inválido', '', 400);
    }
    if (!correo) return respuestaError('Correo requerido', '', 400);
    const user = await prisma.usuario.findUnique({
      where: { correo: correo.toLowerCase().trim() },
      select: { id: true, nombre: true, correo: true },
    });
    if (user) {
      const token = jwt.sign({ id: user.id, tipo: 'reset' }, JWT_SECRET, { expiresIn: 60 * 60 });
      const base = `${req.nextUrl.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}`;
      const enlace = `${base}/restablecer-contrasena/${token}`;
      await enviarCorreoResetContrasena({ correo: user.correo, nombre: user.nombre, enlace });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return respuestaError('Error interno', error.message, 500);
  }
}
