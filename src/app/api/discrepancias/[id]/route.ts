export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import * as logger from '@lib/logger'

function getDiscrepanciaId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'discrepancias')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const id = getDiscrepanciaId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const { aceptado } = await req.json()
    const log = await prisma.logDiscrepancia.update({
      where: { id },
      data: { revisado: true, aceptado: !!aceptado }
    })
    return NextResponse.json({ log })
  } catch (err) {
    logger.error('PUT /api/discrepancias/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
