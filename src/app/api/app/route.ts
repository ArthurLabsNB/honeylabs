export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { appInfoSchema, type AppInfo } from '@/types/app'

const appInfoPath = path.join(process.cwd(), 'lib', 'app-info.json')
const buildStatusPath = path.join(process.cwd(), 'lib', 'build-status.json')

export async function GET() {
  try {
    const infoRaw = await fs.readFile(appInfoPath, 'utf8')
    const info = appInfoSchema.parse(JSON.parse(infoRaw)) as AppInfo
    let building = false
    let progress = 1
    try {
      const statusRaw = await fs.readFile(buildStatusPath, 'utf8')
      const status = JSON.parse(statusRaw) as { building: boolean; progress: number }
      building = Boolean(status.building)
      progress = Number(status.progress) || 0
    } catch {}
    return NextResponse.json({ ...info, building, progress }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'info_unavailable' }, { status: 500 })
  }
}
