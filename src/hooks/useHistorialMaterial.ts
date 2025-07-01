import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface HistorialEntry {
  id: number
  descripcion?: string | null
  ubicacion?: string | null
  cantidad?: number | null
  lote?: string | null
  fecha: string
  estado?: any
}


export default function useHistorialMaterial(materialId?: number | string) {
  const id = Number(materialId)
  const url = !Number.isNaN(id) ? `/api/materiales/${id}/historial` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  })

  return {
    historial: (data?.historial as HistorialEntry[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
