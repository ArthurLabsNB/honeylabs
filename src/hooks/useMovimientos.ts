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
    refreshInterval: 3000,
    revalidateOnFocus: true,
  })

  return {
    movimientos: (data?.movimientos as Movimiento[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
