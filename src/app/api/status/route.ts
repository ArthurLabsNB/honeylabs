export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import * as logger from '@lib/logger'

const EXTERNAL_URL = process.env.STATUS_SERVICE_URL

export async function GET() {
  try {
    const db = getDb().client as SupabaseClient
    await db.from('usuario').select('id').limit(1)

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
