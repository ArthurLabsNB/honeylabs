export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { getUsuarioFromSession } from '@lib/auth';
import * as logger from '@lib/logger';

export async function GET() {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {};
    const boards = prefs.dashboardBoards || { boards: [], activeId: null };
    return NextResponse.json(boards);
  } catch (err) {
    logger.error('GET /api/dashboard/boards', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const data = await req.json();
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {};
    prefs.dashboardBoards = data;
    await prisma.usuario.update({ where: { id: usuario.id }, data: { preferencias: JSON.stringify(prefs) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('POST /api/dashboard/boards', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
