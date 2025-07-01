import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface HistorialUnidadEntry {
  id: number
  descripcion?: string | null
  fecha: string
  estado?: any
  usuario?: { nombre: string }
}


export default function useHistorialUnidad(materialId?: number | string, unidadId?: number | string) {
  const mid = Number(materialId)
  const uid = Number(unidadId)
  const url = !Number.isNaN(mid) && mid > 0 && !Number.isNaN(uid) && uid > 0
    ? `/api/materiales/${mid}/unidades/${uid}/historial`
    : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  })
  return {
    historial: (data?.historial as HistorialUnidadEntry[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
