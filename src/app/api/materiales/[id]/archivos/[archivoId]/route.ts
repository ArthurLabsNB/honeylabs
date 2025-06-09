export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'

function getArchivoIdFromRequest(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex((p) => p === 'archivos')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return new NextResponse('No autenticado', { status: 401 })
    const archivoId = getArchivoIdFromRequest(req)
    if (!archivoId) return new NextResponse('ID inválido', { status: 400 })
    const archivo = await prisma.archivoMaterial.findUnique({
      where: { id: archivoId },
      select: { archivo: true, archivoNombre: true, material: { select: { almacenId: true } } },
    })
    if (!archivo || !archivo.archivo || !archivo.material) return new NextResponse('No encontrado', { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: archivo.material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return new NextResponse('Sin permisos', { status: 403 })
    }
    const ext = archivo.archivoNombre?.split('.').pop()?.toLowerCase() ?? ''
    const mime = MIME_BY_EXT[ext] || 'application/octet-stream'
    const buffer = Buffer.isBuffer(archivo.archivo) ? archivo.archivo : Buffer.from(archivo.archivo)
    return new NextResponse(buffer, { status: 200, headers: { 'Content-Type': mime } })
  } catch (err) {
    logger.error('GET /api/materiales/[id]/archivos/[archivoId]', err)
    return new NextResponse('Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const archivoId = getArchivoIdFromRequest(req)
    if (!archivoId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const archivo = await prisma.archivoMaterial.findUnique({
      where: { id: archivoId },
      select: { material: { select: { almacenId: true } } },
    })
    if (!archivo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: archivo.material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    await prisma.archivoMaterial.delete({ where: { id: archivoId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('DELETE /api/materiales/[id]/archivos/[archivoId]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
