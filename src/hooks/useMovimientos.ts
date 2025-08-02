import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface Movimiento {
  id: number
  tipo: 'entrada' | 'salida' | 'creacion' | 'modificacion' | 'eliminacion'
  cantidad?: number | null
  fecha: string
  descripcion?: string | null
  contexto?: any
  usuario?: { nombre: string }
}


export default function useMovimientos(almacenId?: number | string) {
  const id = Number(almacenId)
  const url = !Number.isNaN(id) ? `/api/almacenes/${id}/movimientos` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    // Menor frecuencia para evitar peticiones excesivas
    refreshInterval: 10000,
    revalidateOnFocus: false,
  })

  return {
    movimientos: (data?.movimientos ?? data?.data ?? []) as Movimiento[],
    loading: isLoading,
    error,
    mutate,
  }
}
