export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { readBuildStatus } from '@lib/buildStatus'

export async function GET() {
  try {
    const status = await readBuildStatus()
    return NextResponse.json(status)
  } catch {
    return NextResponse.json({ building: false, progress: 0 })
  }
}
