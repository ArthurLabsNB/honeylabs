import { useEffect } from 'react'
import { API_EVENTS } from '@lib/apiPaths'

export function startAuditoriasUpdates(
  onUpdate: () => void,
  maxRetries = 5,
) {
  let es: EventSource
  let retry = 1
  let attempts = 0
  const connect = () => {
    es = new EventSource(API_EVENTS)
    es.addEventListener('open', () => {
      retry = 1
      attempts = 0
    })
    es.onmessage = (e) => {
      try {
        const ev = JSON.parse(e.data)
        if (ev.type === 'auditoria_new') {
          onUpdate()
        }
      } catch {}
    }
    es.onerror = async () => {
      es.close()
      attempts += 1
      try {
        const r = await fetch(API_EVENTS, { method: 'HEAD' })
        if (r.status === 401) return
      } catch {}
      if (attempts <= maxRetries) {
        setTimeout(connect, retry * 1000)
        retry = Math.min(retry * 2, 30)
      }
    }
  }
  connect()
  return () => es.close()
}

export default function useAuditoriasUpdates(onUpdate: () => void) {
  useEffect(() => {
    if (!onUpdate) return
    const stop = startAuditoriasUpdates(onUpdate)
    return stop
  }, [onUpdate])
}
