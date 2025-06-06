import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { getUsuarioFromSession } from '@lib/auth';

export async function GET() {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {};
    return NextResponse.json(prefs.dashboardLayout || { widgets: [], layout: [] });
  } catch (err) {
    console.error('GET /api/dashboard/layout', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const data = await req.json();
    const prefs = usuario.preferencias ? JSON.parse(usuario.preferencias) : {};
    prefs.dashboardLayout = data;
    await prisma.usuario.update({ where: { id: usuario.id }, data: { preferencias: JSON.stringify(prefs) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/dashboard/layout', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
