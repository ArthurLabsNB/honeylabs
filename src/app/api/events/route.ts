export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { events } from '@lib/events'
import { ReadableStream } from 'stream/web'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
      }
      events.on('event', send)
      const keep = setInterval(() => controller.enqueue(':keepalive\n\n'), 15000)
      return () => {
        clearInterval(keep)
        events.off('event', send)
      }
    },
  })
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
    },
  })
}
