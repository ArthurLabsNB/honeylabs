import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface Almacen {
  id: number
  nombre: string
  descripcion?: string | null
  imagenUrl?: string | null
  ultimaActualizacion?: string | null
  entradas?: number
  salidas?: number
  inventario?: number
  encargado?: string | null
  correo?: string | null
  notificaciones?: number
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

const EMPTY_ALMACENES: Almacen[] = []

export default function useAlmacenes(opts?: {
  usuarioId?: number
  favoritos?: boolean
}) {
  const params = new URLSearchParams()
  if (opts?.usuarioId) params.set('usuarioId', String(opts.usuarioId))
  if (opts?.favoritos) params.set('favoritos', '1')
  const url = `/api/almacenes${params.toString() ? `?${params.toString()}` : ''}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })

  return {
    almacenes: (data?.almacenes as Almacen[]) ?? EMPTY_ALMACENES,
    loading: isLoading,
    error,
    mutate,
  }
}
