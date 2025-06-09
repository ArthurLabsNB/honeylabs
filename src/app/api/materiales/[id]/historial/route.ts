export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { getUsuarioFromSession } from '@lib/auth';
import { hasManagePerms } from '@lib/permisos';
import * as logger from '@lib/logger';

function getMaterialIdFromRequest(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.findIndex((p) => p === 'materiales');
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null;
  return id && !Number.isNaN(id) ? id : null;
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const id = getMaterialIdFromRequest(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const historial = await prisma.historialLote.findMany({
      where: { materialId: id },
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        descripcion: true,
        ubicacion: true,
        cantidad: true,
        lote: true,
        fecha: true,
        usuario: { select: { nombre: true } },
      },
    });
    return NextResponse.json({ historial });
  } catch (err) {
    logger.error('GET /api/materiales/[id]/historial', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const id = getMaterialIdFromRequest(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const body = await req.json();
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: body.almacenId },
      select: { id: true },
    });
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const entry = await prisma.historialLote.create({
      data: {
        materialId: id,
        lote: body.lote || null,
        descripcion: body.descripcion || null,
        ubicacion: body.ubicacion || null,
        cantidad: body.cantidad ?? null,
        usuarioId: usuario.id,
      },
      select: { id: true },
    });
    return NextResponse.json({ entry });
  } catch (err) {
    logger.error('POST /api/materiales/[id]/historial', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
