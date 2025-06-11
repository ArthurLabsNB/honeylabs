import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface MovimientoMaterial {
  id: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  fecha: string
  descripcion?: string | null
  usuario?: { nombre: string }
  material?: { nombre: string }
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useMovimientosMaterial(materialId?: number | string) {
  const id = Number(materialId)
  const url = !Number.isNaN(id) ? `/api/materiales/${id}/movimientos` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })

  return {
    movimientos: (data?.movimientos as MovimientoMaterial[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
