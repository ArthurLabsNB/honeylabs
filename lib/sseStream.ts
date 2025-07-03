import { ReadableStream } from 'stream/web'

export interface SseController {
  send: (data: unknown) => void
  close: () => void
  readonly signal: AbortSignal
}

export interface SseOptions {
  keepAlive?: number
}

export function sseStream(
  start: (controller: SseController) => void | (() => void) | Promise<void | (() => void)>,
  options: SseOptions = {},
): ReadableStream<Uint8Array> {
  const { keepAlive = 15000 } = options
  const encoder = new TextEncoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const ac = new AbortController()
      const { signal } = ac
      let closed = false
      let timer: NodeJS.Timeout | undefined

      const sendRaw = (text: string) => {
        if (closed || signal.aborted) return
        try {
          controller.enqueue(encoder.encode(text))
        } catch {}
      }

      const send = (data: unknown) => {
        const payload = typeof data === 'string' ? data : JSON.stringify(data)
        sendRaw(`data: ${payload}\n\n`)
      }

      const close = () => {
        if (closed) return
        closed = true
        if (timer) clearInterval(timer)
        ac.abort()
        try {
          controller.close()
        } catch {}
      }

      if (keepAlive > 0) {
        timer = setInterval(() => sendRaw(':keepalive\n\n'), keepAlive)
      }

      signal.addEventListener('abort', close)

      const cleanup = await start({ send, close, signal })

      return () => {
        if (timer) clearInterval(timer)
        if (typeof cleanup === 'function') cleanup()
        close()
      }
    },
  })
}
