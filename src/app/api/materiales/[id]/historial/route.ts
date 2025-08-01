export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/db/prisma';
import { getUsuarioFromSession } from '@lib/auth';
import { hasManagePerms } from '@lib/permisos';
import * as logger from '@lib/logger';

function getMaterialIdFromRequest(req: NextRequest): number | null {
  const match = /\/materiales\/(\d+)/.exec(req.nextUrl.pathname);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isNaN(id) ? null : id;
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
        estado: true,
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
  const materialActual = await prisma.material.findUnique({
    where: { id },
    select: {
      nombre: true,
      descripcion: true,
      miniatura: true,
      miniaturaNombre: true,
      cantidad: true,
      unidad: true,
      lote: true,
      fechaCaducidad: true,
      ubicacion: true,
      proveedor: true,
      estado: true,
      observaciones: true,
      codigoBarra: true,
      codigoQR: true,
      minimo: true,
      maximo: true,
      archivos: {
        select: { nombre: true, archivoNombre: true, archivo: true },
      },
    },
  });
  const estado = materialActual
    ? {
        ...materialActual,
        miniatura: materialActual.miniatura
          ? Buffer.from(materialActual.miniatura as Buffer).toString('base64')
          : null,
        archivos: materialActual.archivos.map((a) => ({
          nombre: a.nombre,
          archivoNombre: a.archivoNombre,
          archivo: a.archivo
            ? Buffer.from(a.archivo as Buffer).toString('base64')
            : null,
        })),
      }
    : null;
  const entry = await prisma.historialLote.create({
    data: {
      materialId: id,
      lote: body.lote || null,
      descripcion: body.descripcion || null,
      ubicacion: body.ubicacion || null,
      cantidad: body.cantidad ?? null,
      usuarioId: usuario.id,
      estado,
    },
    select: { id: true },
  });
    return NextResponse.json({ entry });
  } catch (err) {
    logger.error('POST /api/materiales/[id]/historial', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
