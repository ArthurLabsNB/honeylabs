import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface Movimiento {
  id: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  fecha: string
  descripcion?: string | null
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useMovimientos(almacenId?: number | string) {
  const id = Number(almacenId)
  const url = !Number.isNaN(id) ? `/api/almacenes/${id}/movimientos` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })

  return {
    movimientos: (data?.movimientos as Movimiento[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
