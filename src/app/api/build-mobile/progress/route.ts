export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { TransformStream } from 'stream/web'

const buildStatusPath = path.join(process.cwd(), 'lib', 'build-status.json')

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  const send = async () => {
    try {
      const raw = await fs.readFile(buildStatusPath, 'utf8')
      writer.write(`data: ${raw}\n\n`)
      const status = JSON.parse(raw)
      if (!status.building || status.progress >= 1) {
        clearInterval(interval)
        writer.close()
      }
    } catch {
      writer.write('data: {}\n\n')
    }
  }

  await send()
  const interval = setInterval(send, 1000)
  req.signal.addEventListener('abort', () => {
    clearInterval(interval)
    writer.close()
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
