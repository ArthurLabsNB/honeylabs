export function startAlertasUpdates(
  onUpdate: () => void,
  maxRetries = 5,
) {
  let es: EventSource
  let retry = 1
  let attempts = 0
  const connect = () => {
    es = new EventSource('/api/events')
    es.addEventListener('open', () => {
      retry = 1
      attempts = 0
    })
    es.onmessage = (e) => {
      try {
        const ev = JSON.parse(e.data)
        if (ev.type === 'alertas_update') {
          onUpdate()
        }
      } catch {}
    }
    es.onerror = async () => {
      es.close()
      attempts += 1
      try {
        const r = await fetch('/api/events', { method: 'HEAD' })
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
