import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'
import { jsonOrNull } from '@lib/http'
import { apiFetch } from '@lib/api'

export interface Nota {
  id: number
  tabId: string
  tipo: 'imagen' | 'url' | 'doc' | 'sticky'
  contenido: string
}

export default function useNotas(tabId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    tabId ? `/api/notas?tabId=${tabId}` : null,
    fetcher,
  )
  const notas: Nota[] = data?.notas ?? []

  const crear = async (tipo: Nota['tipo'], contenido: string) => {
    try {
      const res = await apiFetch('/api/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabId, tipo, contenido }),
      })
      const json = await jsonOrNull(res)
      if (res.ok) mutate()
      return json
    } catch {
      return { error: 'Error de red' }
    }
  }

  const actualizar = async (id: number, contenido: string) => {
    try {
      const res = await apiFetch(`/api/notas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido }),
      })
      const json = await jsonOrNull(res)
      if (res.ok) mutate()
      return json
    } catch {
      return { error: 'Error de red' }
    }
  }

  const eliminar = async (id: number) => {
    try {
      await apiFetch(`/api/notas/${id}`, { method: 'DELETE' })
      mutate()
    } catch {}
  }

  return { notas, crear, actualizar, eliminar, isLoading, mutate }
}
