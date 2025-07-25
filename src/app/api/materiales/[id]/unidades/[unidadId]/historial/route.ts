export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'

function getIds(req: NextRequest): { materialId: number | null; unidadId: number | null } {
  const parts = req.nextUrl.pathname.split('/')
  const idxM = parts.findIndex(p => p === 'materiales')
  const idxU = parts.findIndex(p => p === 'unidades')
  const materialId = idxM !== -1 && parts.length > idxM + 1 ? Number(parts[idxM + 1]) : null
  const unidadId = idxU !== -1 && parts.length > idxU + 1 ? Number(parts[idxU + 1]) : null
  return {
    materialId: materialId && !Number.isNaN(materialId) ? materialId : null,
    unidadId: unidadId && !Number.isNaN(unidadId) ? unidadId : null,
  }
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { materialId, unidadId } = getIds(req)
    if (!materialId || !unidadId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id: materialId }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    // @ts-ignore
    const historial = await prisma.historialUnidad.findMany({
      where: { unidadId },
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
    logger.error('GET /api/materiales/[id]/unidades/[unidadId]/historial', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

async function snapshot(unidadId: number, usuarioId: number, descripcion?: string) {
  const unidad = await prisma.materialUnidad.findUnique({
    where: { id: unidadId },
    include: { archivos: { select: { nombre: true, archivoNombre: true, archivo: true } } },
  })
  const estado = unidad
    ? {
        ...unidad,
        imagen: unidad.imagen ? Buffer.from(unidad.imagen as Buffer).toString('base64') : null,
        archivos: unidad.archivos.map(a => ({
          nombre: a.nombre,
          archivoNombre: a.archivoNombre,
          archivo: a.archivo ? Buffer.from(a.archivo as Buffer).toString('base64') : null,
        })),
      }
    : null
  // @ts-ignore
  await prisma.historialUnidad.create({
    data: {
      unidadId,
      usuarioId,
      descripcion: descripcion || null,
      estado,
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const { materialId, unidadId } = getIds(req)
    if (!materialId || !unidadId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const material = await prisma.material.findUnique({ where: { id: materialId }, select: { almacenId: true } })
    if (!material) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const body = await req.json()
    await snapshot(unidadId, usuario.id, body.descripcion)
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST /api/materiales/[id]/unidades/[unidadId]/historial', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
