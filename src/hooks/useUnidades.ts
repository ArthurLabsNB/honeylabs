import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface Unidad {
  id: number
  nombre: string
  codigoQR: string
  internoId?: string
  serie?: string
  codigoBarra?: string
  lote?: string
  qrGenerado?: string
  unidadMedida?: string
  peso?: number
  volumen?: number
  alto?: number
  largo?: number
  ancho?: number
  color?: string
  temperatura?: string
  estado?: string
  ubicacionExacta?: string
  area?: string
  subcategoria?: string
  riesgo?: string
  disponible?: boolean
  asignadoA?: string
  fechaIngreso?: string
  fechaModificacion?: string
  fechaCaducidad?: string
  fechaInspeccion?: string
  fechaBaja?: string
  responsableIngreso?: string
  modificadoPor?: string
  proyecto?: string
  observaciones?: string
  imagen?: string | null
  imagenNombre?: string | null
  [clave: string]: any
}

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(jsonOrNull)

export default function useUnidades(materialId?: number | string) {
  const id = Number(materialId)
  const url = !Number.isNaN(id) && id > 0 ? `/api/materiales/${id}/unidades` : null

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  const registrar = async (descripcion: string, cantidad = 1) => {
    if (Number.isNaN(id) || id <= 0) return
    try {
      const res = await fetch(`/api/materiales/${id}/historial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ descripcion, cantidad }),

      })
      return await jsonOrNull(res)
    } catch {
      return null
    }
  }

  const crear = async (datos: Partial<Unidad> & { nombre: string }) => {
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    const payload: any = { ...datos }
    if (datos.imagen && datos.imagen instanceof File) {
      const buffer = await datos.imagen.arrayBuffer()
      payload.imagen = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      payload.imagenNombre = datos.imagen.name
    }
    const res = await fetch(`/api/materiales/${id}/unidades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),

    })
    const result = await jsonOrNull(res)
    if (res.ok) {
      mutate()
      registrar('Entrada de Unidad')
    }
    return result
  }

  const actualizar = async (unidad: Partial<Unidad> & { id: number }) => {
    if (!unidad.id) return { error: 'ID requerido' }
    const { id: uid, ...payload } = unidad
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    if (payload.imagen && payload.imagen instanceof File) {
      const buffer = await payload.imagen.arrayBuffer()
      ;(payload as any).imagen = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      ;(payload as any).imagenNombre = payload.imagen.name
    }
    const res = await fetch(`/api/materiales/${id}/unidades/${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),

    })
    const result = await jsonOrNull(res)
    if (res.ok) {
      mutate()
      registrar('Modificacion de Unidad')
    }
    return result
  }

  const eliminar = async (unidadId: number) => {
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    if (Number.isNaN(unidadId) || unidadId <= 0)
      return { error: 'ID de unidad inválido' }
    const res = await fetch(`/api/materiales/${id}/unidades/${unidadId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const result = await jsonOrNull(res)
    if (res.ok) {
      mutate()
      registrar('Eliminacion de Unidad')
    }
    return result
  }

  const obtener = async (unidadId: number) => {
    if (Number.isNaN(id) || id <= 0) return undefined
    const res = await fetch(`/api/materiales/${id}/unidades/${unidadId}`, {
      credentials: 'include',
    })
    const result = await jsonOrNull(res)
    const unidad = result?.unidad as Unidad | undefined
    if (unidad) {
      const fechas = [
        'fechaIngreso',
        'fechaModificacion',
        'fechaCaducidad',
        'fechaInspeccion',
        'fechaBaja',
      ] as const
      for (const f of fechas) {
        const v = (unidad as any)[f]
        if (v) {
          const d = new Date(v as any)
          if (!Number.isNaN(d.getTime())) {
            ;(unidad as any)[f] = d.toISOString().slice(0, 10)
          }
        }
      }
    }
    return unidad
  }

  return {
    unidades: (data?.unidades as Unidad[]) ?? [],
    loading: isLoading,
    error,
    crear,
    actualizar,
    eliminar,
    obtener,
    mutate,
  }
}
