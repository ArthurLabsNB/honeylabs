export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/db/prisma';
import { getUsuarioFromSession } from '@lib/auth';
import * as logger from '@lib/logger'

export async function GET() {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {};
    return NextResponse.json(prefs);
  } catch (err) {
    logger.error('GET /api/preferences', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const update = await req.json();
    if (typeof update !== 'object' || Array.isArray(update)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {};
    const merged = { ...prefs, ...update };
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { preferencias: JSON.stringify(merged) },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('PUT /api/preferences', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
