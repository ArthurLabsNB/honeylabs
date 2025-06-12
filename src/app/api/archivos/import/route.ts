export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import * as logger from '@lib/logger'

async function checkDb() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, registros } = body
    if (!tipo || !Array.isArray(registros)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    const ok = await checkDb()
    if (!ok) {
      return NextResponse.json({ error: 'DB offline' }, { status: 500 })
    }
    logger.info('Importando', tipo, registros.length)
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('POST /api/archivos/import', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
