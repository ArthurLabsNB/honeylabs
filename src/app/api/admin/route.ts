import { NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import * as logger from '@lib/logger'

export async function GET() {
  try {
    const [usuarios, almacenes] = await Promise.all([
      prisma.usuario.count(),
      prisma.almacen.count(),
    ])
    const stats = { usuarios, almacenes }
    return NextResponse.json({ stats })
  } catch (err) {
    logger.error('[ADMIN_STATS]', err)
    return NextResponse.json({ error: 'Error obteniendo estadísticas' }, { status: 500 })
  }
}
