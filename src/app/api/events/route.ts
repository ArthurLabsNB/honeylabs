export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { events } from '@/lib/events'
import { sseStream } from '@lib/sseStream'

export async function GET() {
  const stream = sseStream(({ send, signal }) => {
    const sendEvent = (data: any) => send(data)
    events.on('event', sendEvent)
    signal.addEventListener('abort', () => events.off('event', sendEvent))
    return () => events.off('event', sendEvent)
  })
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
    },
  })
}
