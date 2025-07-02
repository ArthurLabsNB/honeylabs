export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const appInfoPath = path.join(process.cwd(), 'lib', 'app-info.json')
const buildStatusPath = path.join(process.cwd(), 'lib', 'build-status.json')
export async function POST(req: NextRequest) {
  const token = process.env.BUILD_TOKEN
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  if (!body || body.token !== token) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { version, url, sha256 } = body
  if (!version || !url || !sha256) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  await fs.writeFile(appInfoPath, JSON.stringify({ version, url, sha256 }, null, 2))
  await fs.writeFile(buildStatusPath, JSON.stringify({ building: false, progress: 1 }))
  return NextResponse.json({ success: true })
}
