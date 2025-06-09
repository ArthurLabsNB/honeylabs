import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface HistorialEntry {
  id: number
  descripcion?: string | null
  ubicacion?: string | null
  cantidad?: number | null
  lote?: string | null
  fecha: string
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useHistorialMaterial(materialId?: number | string) {
  const id = Number(materialId)
  const url = !Number.isNaN(id) ? `/api/materiales/${id}/historial` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })

  return {
    historial: (data?.historial as HistorialEntry[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
