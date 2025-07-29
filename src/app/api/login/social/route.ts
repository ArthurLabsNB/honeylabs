export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

const ALLOWED = ['google', 'github', 'facebook'] as const

export function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get('provider')?.toLowerCase() || ''
  if (!ALLOWED.includes(provider as any)) {
    return NextResponse.json(
      { success: false, error: 'Proveedor inválido' },
      { status: 400 },
    )
  }

  const redirectUrl = new URL(`/api/auth/signin?provider=${provider}`, req.url)
  return NextResponse.redirect(redirectUrl)
}
