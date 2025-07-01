import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface MovimientoMaterial {
  id: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  fecha: string
  descripcion?: string | null
  contexto?: any
  usuario?: { nombre: string }
  material?: { nombre: string }
}


export default function useMovimientosMaterial(materialId?: number | string) {
  const id = Number(materialId)
  const url = !Number.isNaN(id) ? `/api/materiales/${id}/movimientos` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  })

  return {
    movimientos: (data?.movimientos as MovimientoMaterial[]) ?? [],
    loading: isLoading,
    error,
    mutate,
  }
}
