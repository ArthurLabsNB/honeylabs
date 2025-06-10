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
  const url = !Number.isNaN(id) ? `/api/materiales/${id}/unidades` : null

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  const registrar = async (descripcion: string, cantidad = 1) => {
    if (Number.isNaN(id)) return
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
    if (Number.isNaN(id)) return { error: 'ID inválido' }
    const res = await fetch(`/api/materiales/${id}/unidades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(datos),

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

  return {
    unidades: (data?.unidades as Unidad[]) ?? [],
    loading: isLoading,
    error,
    crear,
    actualizar,
    eliminar,
    mutate,
  }
}
