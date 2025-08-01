export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { Prisma } from '@prisma/client'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'
import { registrarAuditoria } from '@lib/reporter'

function getAuditoriaId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'auditorias')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getAuditoriaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const auditoria = await prisma.auditoria.findUnique({ where: { id } })
    if (!auditoria) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    const datos = auditoria.observaciones ? JSON.parse(auditoria.observaciones) : {}
    let creado: any

    if (auditoria.tipo === 'almacen') {
      creado = await prisma.almacen.create({ data: datos, select: { id: true } })
    } else if (auditoria.tipo === 'material') {
      creado = await prisma.material.create({ data: datos, select: { id: true } })
    } else if (auditoria.tipo === 'unidad') {
      creado = await prisma.materialUnidad.create({ data: datos, select: { id: true } })
    } else {
      return NextResponse.json({ error: 'Tipo desconocido' }, { status: 400 })
    }

    const { auditoria: nuevaAuditoria, error: auditError } = await registrarAuditoria(
      req,
      auditoria.tipo as any,
      creado.id,
      'restauracion',
      datos,
    )

    return NextResponse.json({ success: true, auditoria: nuevaAuditoria, auditError })
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2021'
    ) {
      logger.error('POST /api/auditorias/[id]/restore', err)
      return NextResponse.json(
        { error: 'Base de datos no inicializada.' },
        { status: 500 },
      )
    }
    logger.error('POST /api/auditorias/[id]/restore', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
