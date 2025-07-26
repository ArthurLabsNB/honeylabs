export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import * as logger from '@lib/logger'

const EXTERNAL_URL = process.env.STATUS_SERVICE_URL

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`

    if (EXTERNAL_URL) {
      const res = await fetch(EXTERNAL_URL, { method: 'HEAD' })
      if (!res.ok) throw new Error('external')
    }

    return NextResponse.json(
      { status: 'ok' },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    logger.error('[STATUS_ERROR]', err)
    return NextResponse.json(
      { status: 'maintenance' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
