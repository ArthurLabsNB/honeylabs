import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface Auditoria {
  id: number
  tipo: string
  categoria?: string | null
  fecha: string
  observaciones?: string | null
  usuario?: { nombre: string }
  almacen?: { nombre: string }
  material?: { nombre: string }
  unidad?: { nombre: string }
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useAuditorias(opts?: { tipo?: string }) {
  const params = new URLSearchParams()
  if (opts?.tipo && opts.tipo !== 'todos') params.set('tipo', opts.tipo)
  const url = `/api/auditorias${params.toString() ? `?${params.toString()}` : ''}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })

  return {
    auditorias: (data?.auditorias as Auditoria[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
