import { useEffect } from 'react'
import useSWR from 'swr'
import { apiFetch } from '@lib/api'
import fetcher from '@lib/swrFetcher'
import { API_EVENTS } from '@lib/apiPaths'

export interface AlmacenUsuario {
  correo: string
  nombre?: string | null
  rol: string
}

export function startAlmacenUsuariosUpdates(
  almacenId: number,
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
        if (
          ev.type === 'usuarios_update' &&
          ev.payload?.almacenId === almacenId
        ) {
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

export default function useAlmacenUsuarios(almacenId?: number | string) {
  const id = Number(almacenId)
  const url = !Number.isNaN(id) ? `/api/almacenes/${id}/usuarios` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  useEffect(() => {
    if (!url) return
    const stop = startAlmacenUsuariosUpdates(id, mutate)
    return stop
  }, [id, url, mutate])

  const revocar = async (correo: string) => {
    if (!url) return
    await apiFetch(
      `/api/almacenes/${id}/usuarios?correo=${encodeURIComponent(correo)}`,
      { method: 'DELETE' },
    )
    mutate()
  }

  return {
    usuarios: (data?.usuarios as AlmacenUsuario[]) ?? [],
    loading: isLoading,
    error,
    revocar,
    mutate,
  }
}
