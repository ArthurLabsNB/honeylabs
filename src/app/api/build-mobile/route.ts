export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import * as logger from '@lib/logger'

const buildStatusPath = path.join(process.cwd(), 'lib', 'build-status.json')

export async function POST(req: NextRequest) {
  const usuario = await getUsuarioFromSession(req)
  if (!usuario || !hasManagePerms(usuario)) {
    return NextResponse.json({ error: 'no_autorizado' }, { status: 401 })
  }
  try {
    const status = { building: true, progress: 0 }
    await fs.writeFile(buildStatusPath, JSON.stringify(status))
    // In real app we would trigger repository_dispatch here
    logger.info('[BUILD_MOBILE] build triggered')
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('[BUILD_MOBILE]', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const statusRaw = await fs.readFile(buildStatusPath, 'utf8')
    const status = JSON.parse(statusRaw) as { building: boolean; progress: number }
    return NextResponse.json(status)
  } catch {
    return NextResponse.json({ building: false, progress: 0 })
  }
}
