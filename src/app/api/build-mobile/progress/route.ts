export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ReadableStream } from 'stream/web'

const buildStatusPath = path.join(process.cwd(), 'lib', 'build-status.json')

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const timer = setInterval(async () => {
        const s = await fs.readFile(buildStatusPath, 'utf8').then(JSON.parse)
        controller.enqueue(`data: ${JSON.stringify(s)}\n\n`)
        if (!s.building) {
          clearInterval(timer)
          controller.close()
        }
      }, 2000)
    },
  })
  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
