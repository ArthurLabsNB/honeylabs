export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { env } from 'process'
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
    await fs.writeFile(buildStatusPath, JSON.stringify({ building: true, progress: 0 }))
    const repo = env.GITHUB_REPO
    const token = env.GITHUB_TOKEN
    if (repo && token) {
      fetch(`https://api.github.com/repos/${repo}/dispatches`, {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'honeylabs-build',
          Accept: 'application/vnd.github+json',
        },
        body: JSON.stringify({ event_type: 'mobile_build' }),
      }).catch((err) => logger.error('[BUILD_MOBILE] dispatch error', err))
    }
    return NextResponse.json({ ok: true }, { status: 202 })
  } catch (err) {
    logger.error('[BUILD_MOBILE]', err)
    await fs.writeFile(buildStatusPath, JSON.stringify({ building: false, progress: 0 }))
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
