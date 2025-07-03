export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { env } from 'process'
import { sseStream } from '@lib/sseStream'
import { readBuildStatus } from '@lib/buildStatus'


export async function GET() {
  const repo = env.GITHUB_REPO
  const token = env.GITHUB_TOKEN
  const stream = sseStream(async ({ send, close, signal }) => {
    if (!repo || !token) {
      const sendStatus = async () => {
        const status = await readBuildStatus()
        send(status)
        if (!status.building) close()
      }
      await sendStatus()
      const timer = setInterval(sendStatus, 2000)
      signal.addEventListener('abort', () => clearInterval(timer))
      return () => clearInterval(timer)
    }
    const fetchProgress = async () => {
      if (signal.aborted) return
      const res = await fetch(
        `https://api.github.com/repos/${repo}/commits/main/check-runs?check_name=mobile-build`,
        {
          headers: {
            Authorization: `token ${token}`,
            'User-Agent': 'honeylabs-progress',
            Accept: 'application/vnd.github+json',
          },
        },
      )
      if (signal.aborted) return
      if (res.ok) {
        const data = await res.json()
        const run = data.check_runs?.[0]
        if (run) {
          const summary = run.output?.summary as string | undefined
          const m = summary?.match(/progress:\s*(\d+(?:\.\d+)?)/)
          const progress = m ? Number(m[1]) : run.status === 'completed' ? 1 : 0
          send({ progress, building: run.status !== 'completed' })
          if (run.status === 'completed') close()
          return
        }
      }
      send({ progress: 0, building: false })
    }
    await fetchProgress()
    const timer = setInterval(fetchProgress, 2000)
    signal.addEventListener('abort', () => clearInterval(timer))
    return () => clearInterval(timer)
  })
  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
