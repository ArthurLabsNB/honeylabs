import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'
import { jsonOrNull } from '@lib/http'
import { useMemo } from 'react'
import { generarUUID } from '@/lib/uuid'
import { apiFetch } from '@lib/api'
import { parseId } from '@/lib/parseId'
import { AUDIT_PREVIEW_EVENT } from '@/lib/ui-events'
import type { Material } from '@/app/dashboard/almacenes/components/MaterialRow'


const EMPTY_MATERIALS: Material[] = []

const genId = () => generarUUID()

export default function useMateriales(almacenId?: number | string) {
  const id = parseId(almacenId)
  const url = id ? `/api/almacenes/${id}/materiales` : null

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })

  const crear = async (m: Material) => {
    if (Number.isNaN(id)) return { error: 'Sin almacén' }
    try {
      const form = new FormData()
      form.append('nombre', m.nombre)
      if (m.descripcion) form.append('descripcion', m.descripcion)
      if (typeof m.cantidad === 'number' && !Number.isNaN(m.cantidad)) {
        form.append('cantidad', String(m.cantidad))
      }
      if (m.unidad) form.append('unidad', m.unidad)
      if (m.lote) form.append('lote', m.lote)
      if (m.fechaCaducidad && !Number.isNaN(Date.parse(m.fechaCaducidad))) {
        form.append('fechaCaducidad', m.fechaCaducidad)
      }
      if (m.ubicacion) form.append('ubicacion', m.ubicacion)
      if (m.proveedor) form.append('proveedor', m.proveedor)
      if (m.estado) form.append('estado', m.estado)
      if (m.observaciones) form.append('observaciones', m.observaciones)
      if (typeof m.minimo === 'number' && !Number.isNaN(m.minimo)) {
        form.append('minimo', String(m.minimo))
      }
      if (typeof m.maximo === 'number' && !Number.isNaN(m.maximo)) {
        form.append('maximo', String(m.maximo))
      }
      if (m.codigoBarra) form.append('codigoBarra', m.codigoBarra)
      if (m.codigoQR) form.append('codigoQR', m.codigoQR)
      if (m.miniatura) form.append('miniatura', m.miniatura)
      const res = await apiFetch(`/api/almacenes/${id}/materiales`, { method: 'POST', body: form })
      const data = await jsonOrNull(res)
      if (res.ok) {
        const materialId = data?.material?.id
        if (materialId && m.archivos && m.archivos.length) {
          await Promise.all(
            m.archivos.map(async (file) => {
              const fd = new FormData()
              fd.append('nombre', file.name)
              fd.append('archivo', file)
              await apiFetch(`/api/materiales/${materialId}/archivos`, {
                method: 'POST',
                body: fd,
              })
            }),
          )
        }
        mutate()
        if (data?.auditoria?.id) {
          window.dispatchEvent(new CustomEvent(AUDIT_PREVIEW_EVENT, { detail: true }))
        }
      }
      return data
    } catch {
      return { error: 'Error de red' }
    }
  }

  const actualizar = async (m: Material) => {
    if (!m.dbId) return { error: 'ID requerido' }
    try {
      const form = new FormData()
      form.append('nombre', m.nombre)
      if (m.descripcion) form.append('descripcion', m.descripcion)
      if (typeof m.cantidad === 'number' && !Number.isNaN(m.cantidad)) {
        form.append('cantidad', String(m.cantidad))
      }
      if (m.unidad) form.append('unidad', m.unidad)
      if (m.lote) form.append('lote', m.lote)
      if (m.fechaCaducidad && !Number.isNaN(Date.parse(m.fechaCaducidad))) {
        form.append('fechaCaducidad', m.fechaCaducidad)
      }
      if (m.ubicacion) form.append('ubicacion', m.ubicacion)
      if (m.proveedor) form.append('proveedor', m.proveedor)
      if (m.estado) form.append('estado', m.estado)
      if (m.observaciones) form.append('observaciones', m.observaciones)
      if (typeof m.minimo === 'number' && !Number.isNaN(m.minimo)) {
        form.append('minimo', String(m.minimo))
      }
      if (typeof m.maximo === 'number' && !Number.isNaN(m.maximo)) {
        form.append('maximo', String(m.maximo))
      }
      if (m.codigoBarra) form.append('codigoBarra', m.codigoBarra)
      if (m.codigoQR) form.append('codigoQR', m.codigoQR)
      if (m.miniatura) form.append('miniatura', m.miniatura)
      const res = await apiFetch(`/api/materiales/${m.dbId}`, { method: 'PUT', body: form })
      const data = await jsonOrNull(res)
      if (res.ok) {
        if (m.archivos && m.archivos.length) {
          await Promise.all(
            m.archivos.map(async (file) => {
              const fd = new FormData()
              fd.append('nombre', file.name)
              fd.append('archivo', file)
              await apiFetch(`/api/materiales/${m.dbId}/archivos`, {
                method: 'POST',
                body: fd,
              })
            }),
          )
        }
        mutate()
        if (data?.auditoria?.id) {
          window.dispatchEvent(new CustomEvent(AUDIT_PREVIEW_EVENT, { detail: true }))
        }
      }
      return data
    } catch {
      return { error: 'Error de red' }
    }
  }

  const eliminar = async (materialId: number) => {
    try {
      const res = await apiFetch(`/api/materiales/${materialId}`, { method: 'DELETE' })
      const data = await jsonOrNull(res)
      if (res.ok) {
        mutate()
        if (data?.auditoria?.id) {
          window.dispatchEvent(new CustomEvent(AUDIT_PREVIEW_EVENT, { detail: true }))
        }
      }
      return data
    } catch {
      return { error: 'Error de red' }
    }
  }

  const duplicar = async (materialId: number) => {
    try {
      const res = await apiFetch(`/api/materiales/${materialId}/duplicar`, { method: 'POST' })
      const data = await jsonOrNull(res)
      if (res.ok && data?.material) {
        mutate()
      }
      return data
    } catch {
      return { error: 'Error de red' }
    }
  }

  const mats = useMemo(
    () =>
      (data?.materiales as any[] | undefined)?.map((m) => ({
        id: String(m.id ?? genId()),
        dbId: m.id,
        ...m,
        numUnidades: m._count?.unidades ?? 0,
        fechaCaducidad: m.fechaCaducidad?.slice(0, 10) ?? '',
        miniaturaUrl: m.miniaturaNombre
          ? `/api/materiales/archivo?nombre=${encodeURIComponent(m.miniaturaNombre)}`
          : null,
      })) as Material[] | undefined,
    [data],
  )

  return {
    materiales: mats ?? EMPTY_MATERIALS,
    isLoading,
    error,
    mutate,
    crear,
    actualizar,
    eliminar,
    duplicar,
  }
}
