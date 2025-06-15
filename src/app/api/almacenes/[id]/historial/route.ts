export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'

function getAlmacenId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'almacenes')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAlmacenId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: id },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const historial = await prisma.historialAlmacen.findMany({
      where: { almacenId: id },
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        descripcion: true,
        fecha: true,
        estado: true,
        usuario: { select: { nombre: true } },
      },
    })
    return NextResponse.json({ historial })
  } catch (err) {
    logger.error('GET /api/almacenes/[id]/historial', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

async function snapshot(almacenId: number, usuarioId: number, descripcion: string) {
  const almacen = await prisma.almacen.findUnique({
    where: { id: almacenId },
    select: {
      nombre: true,
      descripcion: true,
      imagen: true,
      imagenNombre: true,
      imagenUrl: true,
      codigoUnico: true,
    },
  })
  const estado = almacen
    ? {
        ...almacen,
        imagen: almacen.imagen
          ? Buffer.from(almacen.imagen as Buffer).toString('base64')
          : null,
      }
    : null
  await prisma.historialAlmacen.create({
    data: { almacenId, usuarioId, descripcion, estado },
  })
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAlmacenId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: id },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const body = await req.json()
    await snapshot(id, usuario.id, body.descripcion || 'Modificación')
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST /api/almacenes/[id]/historial', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export { snapshot }
