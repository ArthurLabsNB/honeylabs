import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface HistorialAlmacenEntry {
  id: number
  descripcion?: string | null
  fecha: string
  estado?: any
  usuario?: { nombre: string }
}


export default function useHistorialAlmacen(almacenId?: number | string) {
  const id = Number(almacenId)
  const url = !Number.isNaN(id) ? `/api/almacenes/${id}/historial` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    // Menor frecuencia para evitar peticiones excesivas
    refreshInterval: 10000,
    revalidateOnFocus: false,
  })

  return {
    historial: (data?.historial as HistorialAlmacenEntry[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
