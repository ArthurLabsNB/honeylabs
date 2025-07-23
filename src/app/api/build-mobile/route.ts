export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { env } from 'process'
if (process.env.NODE_ENV !== 'production') {
  await import('dotenv/config')
}
import { getUsuarioFromSession } from '@lib/auth'
import { isAdminUser } from '@lib/permisos'
import { detectNativeChanges } from '@lib/mobile'
import * as logger from '@lib/logger'
import { updateBuildStatus, readBuildStatus } from '@lib/buildStatus'
import { z } from 'zod'

let lastRun = 0

export async function POST(req: NextRequest) {
  const usuario = await getUsuarioFromSession(req)
  if (!usuario) {
    return NextResponse.json({ error: 'no_autenticado' }, { status: 401 })
  }
  if (!isAdminUser(usuario)) {
    return NextResponse.json({ error: 'no_autorizado' }, { status: 403 })
  }
  const csrf = req.headers.get('x-csrf-token')
  if (process.env.CSRF_TOKEN && csrf !== process.env.CSRF_TOKEN) {
    return NextResponse.json({ error: 'csrf_invalid' }, { status: 403 })
  }
  if (Date.now() - lastRun < 10000) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }
  try {
    const prev = await readBuildStatus()
    if (prev.building) {
      return NextResponse.json({ error: 'busy' }, { status: 429 })
    }
  } catch {}

  const schema = z.object({
    type: z.enum(['auto', 'manual']).optional(),
    commit: z.string().length(64).optional(),
  })

  let body: any = {}
  try {
    const raw = await req.text()
    if (raw) body = schema.parse(JSON.parse(raw))
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const { GITHUB_REPO, GITHUB_TOKEN, GITHUB_BRANCH } = process.env
  if (!GITHUB_REPO || !GITHUB_TOKEN) {
    await updateBuildStatus({ building: false, progress: 0 })
    return NextResponse.json({ error: 'missing_env' }, { status: 500 })
  }
  const workflow = path.join(process.cwd(), '.github', 'workflows', 'mobile.yml')
  try {
    await fs.access(workflow)
  } catch {
    await updateBuildStatus({ building: false, progress: 0 })
    return NextResponse.json({ error: 'workflow_missing' }, { status: 500 })
  }

  await updateBuildStatus({ building: true, progress: 0 })
  lastRun = Date.now()

  try {
    const native = await detectNativeChanges()
    const ref = body.commit || GITHUB_BRANCH || 'main'
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/mobile.yml/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'honeylabs-build',
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({ ref, inputs: { event: native ? 'native' : 'ota', type: body.type || 'auto' } }),
    })
    if (!res.ok) {
      const error = await res.text()
      await updateBuildStatus({ building: false, progress: 0, error })
      return NextResponse.json({ error: 'workflow_dispatch_failed', details: error }, { status: 500 })
    }
    return NextResponse.json({ ok: true }, { status: 202 })
  } catch (err: any) {
    logger.error('[BUILD_MOBILE] Error:', err.message)
    await updateBuildStatus({ building: false, progress: 0, error: err.message })
    return NextResponse.json({ error: 'dispatch_error', message: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const status = await readBuildStatus()
    return NextResponse.json(status)
  } catch {
    return NextResponse.json({ building: false, progress: 0 })
  }
}
