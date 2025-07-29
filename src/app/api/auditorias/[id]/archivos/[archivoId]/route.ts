export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

function getArchivoId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'archivos')
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
    const archivoId = getArchivoId(req)
    if (!archivoId) return new NextResponse('ID inválido', { status: 400 })
    const archivo = await prisma.archivoAuditoria.findUnique({
      where: { id: archivoId },
      select: { archivo: true, archivoNombre: true },
    })
    if (!archivo || !archivo.archivo) return new NextResponse('No encontrado', { status: 404 })
    const ext = archivo.archivoNombre?.split('.').pop()?.toLowerCase() ?? ''
    const mime = MIME_BY_EXT[ext] || 'application/octet-stream'
    const buffer = Buffer.isBuffer(archivo.archivo) ? archivo.archivo : Buffer.from(archivo.archivo)
    return new NextResponse(buffer, { status: 200, headers: { 'Content-Type': mime } })
  } catch (err) {
    logger.error('GET /api/auditorias/[id]/archivos/[archivoId]', err)
    return new NextResponse('Error', { status: 500 })
  }
}
