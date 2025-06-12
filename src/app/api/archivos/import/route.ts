export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import * as logger from '@lib/logger'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, registros } = body
    if (!tipo || !Array.isArray(registros)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    logger.info('Importando', tipo, registros.length)
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('POST /api/archivos/import', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
