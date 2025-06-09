import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'
import type { Material } from '@/app/dashboard/almacenes/components/MaterialRow'

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

const EMPTY_MATERIALS: Material[] = []

export default function useMateriales(almacenId?: number | string) {
  const id = Number(almacenId)
  const url = !Number.isNaN(id) ? `/api/almacenes/${id}/materiales` : null

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })

  const crear = async (m: Material) => {
    if (Number.isNaN(id)) return { error: 'Sin almacén' }
    const form = new FormData()
    form.append('nombre', m.producto)
    if (m.descripcion) form.append('descripcion', m.descripcion)
    form.append('cantidad', String(m.cantidad))
    if (m.unidad) form.append('unidad', m.unidad)
    if (m.lote) form.append('lote', m.lote)
    if (m.fechaCaducidad) form.append('fechaCaducidad', m.fechaCaducidad)
    if (m.ubicacion) form.append('ubicacion', m.ubicacion)
    if (m.proveedor) form.append('proveedor', m.proveedor)
    if (m.estado) form.append('estado', m.estado)
    if (m.observaciones) form.append('observaciones', m.observaciones)
    if (typeof m.minimo === 'number') form.append('minimo', String(m.minimo))
    if (typeof m.maximo === 'number') form.append('maximo', String(m.maximo))
    if (m.codigoBarra) form.append('codigoBarra', m.codigoBarra)
    if (m.codigoQR) form.append('codigoQR', m.codigoQR)
    if (m.miniatura) form.append('miniatura', m.miniatura)
    const res = await fetch(`/api/almacenes/${id}/materiales`, { method: 'POST', body: form })
    const data = await jsonOrNull(res)
    if (res.ok) mutate()
    return data
  }

  const actualizar = async (m: Material) => {
    if (!m.id) return { error: 'ID requerido' }
    const form = new FormData()
    form.append('nombre', m.producto)
    if (m.descripcion) form.append('descripcion', m.descripcion)
    form.append('cantidad', String(m.cantidad))
    if (m.unidad) form.append('unidad', m.unidad)
    if (m.lote) form.append('lote', m.lote)
    if (m.fechaCaducidad) form.append('fechaCaducidad', m.fechaCaducidad)
    if (m.ubicacion) form.append('ubicacion', m.ubicacion)
    if (m.proveedor) form.append('proveedor', m.proveedor)
    if (m.estado) form.append('estado', m.estado)
    if (m.observaciones) form.append('observaciones', m.observaciones)
    if (typeof m.minimo === 'number') form.append('minimo', String(m.minimo))
    if (typeof m.maximo === 'number') form.append('maximo', String(m.maximo))
    if (m.codigoBarra) form.append('codigoBarra', m.codigoBarra)
    if (m.codigoQR) form.append('codigoQR', m.codigoQR)
    if (m.miniatura) form.append('miniatura', m.miniatura)
    const res = await fetch(`/api/materiales/${m.id}`, { method: 'PUT', body: form })
    const data = await jsonOrNull(res)
    if (res.ok) mutate()
    return data
  }

  const eliminar = async (materialId: number) => {
    const res = await fetch(`/api/materiales/${materialId}`, { method: 'DELETE' })
    const data = await jsonOrNull(res)
    if (res.ok) mutate()
    return data
  }

  const mats = (data?.materiales as any[] | undefined)?.map((m) => ({
    ...m,
    producto: m.nombre,
    fechaCaducidad: m.fechaCaducidad?.slice(0, 10) ?? '',
  })) as Material[] | undefined

  return {
    materiales: mats ?? EMPTY_MATERIALS,
    loading: isLoading,
    error,
    mutate,
    crear,
    actualizar,
    eliminar,
  }
}
