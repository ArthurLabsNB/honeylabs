import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

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

export default function useAuditorias(opts?: { tipo?: string, categoria?: string, q?: string, desde?: string, hasta?: string, almacenId?: number, materialId?: number, unidadId?: number }) {
  const params = new URLSearchParams()
  if (opts?.tipo && opts.tipo !== 'todos') params.set('tipo', opts.tipo)
  if (opts?.categoria && opts.categoria !== 'todas') params.set('categoria', opts.categoria)
  if (opts?.q) params.set('q', opts.q)
  if (opts?.desde) params.set('desde', opts.desde)
  if (opts?.hasta) params.set('hasta', opts.hasta)
  if (opts?.almacenId) params.set('almacenId', String(opts.almacenId))
  if (opts?.materialId) params.set('materialId', String(opts.materialId))
  if (opts?.unidadId) params.set('unidadId', String(opts.unidadId))
  const url = `/api/auditorias${params.toString() ? `?${params.toString()}` : ''}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  })

  return {
    auditorias: (data?.auditorias as Auditoria[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
