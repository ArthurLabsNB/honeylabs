export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const appInfoPath = path.join(process.cwd(), 'lib', 'app-info.json')

export async function GET() {
  try {
    const raw = await fs.readFile(appInfoPath, 'utf8')
    const { url } = JSON.parse(raw) as { url: string }
    if (!url) throw new Error('invalid')
    return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'info_unavailable' }, { status: 500 })
  }
}
