export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import * as logger from '@lib/logger'

const ALLOWED = ['google', 'github', 'gmail', 'facebook'] as const

export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get('provider')?.toLowerCase() || ''
  if (!ALLOWED.includes(provider as any)) {
    return NextResponse.json(
      { success: false, error: 'Proveedor inválido' },
      { status: 400 },
    )
  }

  logger.info(req, 'OAuth login', provider)
  return NextResponse.json(
    { success: false, error: 'OAuth no habilitado' },
    { status: 501 },
  )
}
