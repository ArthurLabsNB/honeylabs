export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { ReadableStream } from 'stream/web'
import { env } from 'process'


export async function GET() {
  const repo = env.GITHUB_REPO
  const token = env.GITHUB_TOKEN
  const stream = new ReadableStream({
    async start(controller) {
      if (!repo || !token) {
        controller.enqueue('data: {"error":"github_not_configured"}\n\n')
        controller.close()
        return
      }
      const fetchProgress = async () => {
        const res = await fetch(`https://api.github.com/repos/${repo}/commits/main/check-runs?check_name=mobile-build`, {
          headers: {
            Authorization: `token ${token}`,
            'User-Agent': 'honeylabs-progress',
            Accept: 'application/vnd.github+json',
          },
        })
        if (res.ok) {
          const data = await res.json()
          const run = data.check_runs?.[0]
          if (run) {
            const summary = run.output?.summary as string | undefined
            const m = summary?.match(/progress:\s*(\d+(?:\.\d+)?)/)
            const progress = m ? Number(m[1]) : run.status === 'completed' ? 1 : 0
            controller.enqueue(`data: ${JSON.stringify({ progress, building: run.status !== 'completed' })}\n\n`)
            if (run.status === 'completed') controller.close()
            return
          }
        }
        controller.enqueue('data: {"progress":0,"building":false}\n\n')
      }
      await fetchProgress()
      const timer = setInterval(fetchProgress, 5000)
      return () => clearInterval(timer)
    },
  })
  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
