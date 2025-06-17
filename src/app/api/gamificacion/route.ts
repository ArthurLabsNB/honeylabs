export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { getLogros } from '@lib/gamificacion'

export async function GET() {
  try {
    const logros = getLogros()
    return NextResponse.json({ logros })
  } catch (err) {
    return NextResponse.json({ error: 'No disponible' }, { status: 500 })
  }
}
