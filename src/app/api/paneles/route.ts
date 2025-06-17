import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { getUsuarioFromSession } from '@lib/auth';
import { randomUUID } from 'crypto';
import * as logger from '@lib/logger';

export async function GET() {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {};
    const paneles = prefs.paneles || [];
    return NextResponse.json({ paneles });
  } catch (err) {
    logger.error('GET /api/paneles', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const { nombre } = await req.json();
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {};
    const paneles = Array.isArray(prefs.paneles) ? prefs.paneles : [];
    const id = randomUUID();
    paneles.push({ id, nombre: nombre || 'Sin título', widgets: [], layout: [], fechaMod: new Date().toISOString() });
    prefs.paneles = paneles;
    await prisma.usuario.update({ where: { id: usuario.id }, data: { preferencias: JSON.stringify(prefs) } });
    return NextResponse.json({ id });
  } catch (err) {
    logger.error('POST /api/paneles', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
