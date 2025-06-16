import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface HistorialAlmacenEntry {
  id: number
  descripcion?: string | null
  fecha: string
  estado?: any
  usuario?: { nombre: string }
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useHistorialAlmacen(almacenId?: number | string) {
  const id = Number(almacenId)
  const url = !Number.isNaN(id) ? `/api/almacenes/${id}/historial` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  })

  return {
    historial: (data?.historial as HistorialAlmacenEntry[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
