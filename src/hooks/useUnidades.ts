import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface Unidad {
  id: number
  nombre: string
  codigoQR: string
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useUnidades(materialId?: number | string) {
  const id = Number(materialId)
  const url = !Number.isNaN(id) ? `/api/materiales/${id}/unidades` : null

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  const registrar = async (descripcion: string) => {
    if (Number.isNaN(id)) return
    try {
      await fetch(`/api/materiales/${id}/historial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, cantidad: 1 }),
      })
    } catch {}
  }

  const crear = async (nombre: string) => {
    if (Number.isNaN(id)) return { error: 'ID inválido' }
    const res = await fetch(`/api/materiales/${id}/unidades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre }),
    })
    const result = await jsonOrNull(res)
    if (res.ok) {
      mutate()
      registrar('Entrada de Unidad')
    }
    return result
  }

  const actualizar = async (unidad: Unidad) => {
    if (!unidad.id) return { error: 'ID requerido' }
    const res = await fetch(`/api/materiales/${id}/unidades/${unidad.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: unidad.nombre }),
    })
    const result = await jsonOrNull(res)
    if (res.ok) {
      mutate()
      registrar('Modificacion de Unidad')
    }
    return result
  }

  const eliminar = async (unidadId: number) => {
    const res = await fetch(`/api/materiales/${id}/unidades/${unidadId}`, { method: 'DELETE' })
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
