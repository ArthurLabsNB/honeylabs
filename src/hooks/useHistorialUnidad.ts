import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface HistorialUnidadEntry {
  id: number
  descripcion?: string | null
  fecha: string
  estado?: any
  usuario?: { nombre: string }
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useHistorialUnidad(materialId?: number | string, unidadId?: number | string) {
  const mid = Number(materialId)
  const uid = Number(unidadId)
  const url = !Number.isNaN(mid) && mid > 0 && !Number.isNaN(uid) && uid > 0
    ? `/api/materiales/${mid}/unidades/${uid}/historial`
    : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })
  return {
    historial: (data?.historial as HistorialUnidadEntry[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
