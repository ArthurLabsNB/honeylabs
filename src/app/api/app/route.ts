export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { appInfoSchema, type AppInfo } from '@/types/app'
import { env } from 'process'

const appInfoPath = path.join(process.cwd(), 'lib', 'app-info.json')

export async function GET() {
  try {
    const infoRaw = await fs.readFile(appInfoPath, 'utf8')
    const info = appInfoSchema.parse(JSON.parse(infoRaw)) as AppInfo
    const repo = env.GITHUB_REPO
    const token = env.GITHUB_TOKEN
    let building = false
    let progress = 1
    if (repo && token) {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/commits/main/check-runs?check_name=mobile-build`, {
          headers: {
            Authorization: `token ${token}`,
            'User-Agent': 'honeylabs-app-info',
            Accept: 'application/vnd.github+json',
          },
        })
        if (res.ok) {
          const data = await res.json()
          const run = data.check_runs?.[0]
          if (run) {
            building = run.status !== 'completed'
            const summary = run.output?.summary as string | undefined
            const m = summary?.match(/progress:\s*(\d+(?:\.\d+)?)/)
            progress = m ? Number(m[1]) : building ? 0 : 1
          }
        }
      } catch {}
    }
    return NextResponse.json({ ...info, building, progress }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'info_unavailable' }, { status: 500 })
  }
}
