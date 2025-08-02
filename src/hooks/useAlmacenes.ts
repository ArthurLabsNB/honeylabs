import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface Almacen {
  id: number
  nombre: string
  descripcion?: string | null
  imagenUrl?: string | null
  fechaCreacion?: string | null
  ultimaActualizacion?: string | null
  entradas: number
  salidas: number
  inventario: number
  unidades: number
  encargado?: string | null
  correo?: string | null
  notificaciones: number
  codigoUnico?: string
}


const EMPTY_ALMACENES: Almacen[] = []

function normalize(raw: any): Almacen {
  return {
    id: Number(raw.id),
    nombre: String(raw.nombre),
    descripcion: raw.descripcion ?? null,
    imagenUrl: raw.imagenUrl ?? raw.imagen_url ?? null,
    fechaCreacion: raw.fechaCreacion ?? raw.fecha_creacion ?? null,
    ultimaActualizacion:
      raw.ultimaActualizacion ?? raw.ultima_actualizacion ?? null,
    entradas: Number(raw.entradas ?? raw.total_entradas ?? 0),
    salidas: Number(raw.salidas ?? raw.total_salidas ?? 0),
    inventario: Number(raw.inventario ?? raw.materiales ?? 0),
    unidades: Number(raw.unidades ?? raw.total_unidades ?? 0),
    encargado: raw.encargado ?? raw.encargado_nombre ?? null,
    correo: raw.correo ?? raw.encargado_correo ?? null,
    notificaciones: Number(raw.notificaciones ?? raw.notificaciones_count ?? 0),
    codigoUnico: raw.codigoUnico ?? raw.codigo_unico ?? undefined,
  }
}

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

  const raw = (data?.almacenes as any[]) ?? EMPTY_ALMACENES

  return {
    almacenes: raw.map(normalize),
    loading: isLoading,
    error,
    mutate,
  }
}
