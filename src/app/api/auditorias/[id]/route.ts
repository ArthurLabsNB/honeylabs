export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client'
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
    const auditoria = await prisma.auditoria.findUnique({
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
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2021'
    ) {
      logger.error('GET /api/auditorias/[id]', err)
      return NextResponse.json(
        { error: 'Base de datos no inicializada.' },
        { status: 500 },
      )
    }
    logger.error('GET /api/auditorias/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAuditoriaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    await prisma.archivoAuditoria.deleteMany({ where: { auditoriaId: id } })
    await prisma.auditoria.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2021'
    ) {
      logger.error('DELETE /api/auditorias/[id]', err)
      return NextResponse.json(
        { error: 'Base de datos no inicializada.' },
        { status: 500 },
      )
    }
    logger.error('DELETE /api/auditorias/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
