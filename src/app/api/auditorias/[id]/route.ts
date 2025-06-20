export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

function getAuditoriaId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'auditorias')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAuditoriaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const auditoria = await prisma.reporte.findUnique({
      where: { id },
      include: {
        usuario: { select: { nombre: true } },
        almacen: { select: { nombre: true } },
        material: { select: { nombre: true } },
        unidad: { select: { nombre: true } },
        archivos: { select: { id: true, nombre: true, archivoNombre: true } },
      },
    })
    if (!auditoria) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ auditoria })
  } catch (err) {
    logger.error('GET /api/auditorias/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
