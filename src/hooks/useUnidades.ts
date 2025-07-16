import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'
import fetcher from '@lib/swrFetcher'
import { apiFetch } from '@lib/api'
import { parseId } from '@/lib/parseId'
import { AUDIT_PREVIEW_EVENT } from '@/lib/ui-events'

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const res = reader.result
      if (typeof res === 'string') {
        const comma = res.indexOf(',')
        resolve(comma >= 0 ? res.slice(comma + 1) : res)
      } else {
        reject(new Error('error reading file'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const cleanPayload = (obj: Record<string, any>) => {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === '' || v === null || v === undefined) continue
    if (typeof v === 'number' && Number.isNaN(v)) continue
    out[k] = v
  }
  return out
}
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
  archivos?: {
    id: number
    nombre: string
    archivoNombre: string
    fecha?: string
    archivo: string | null
  }[]
  [clave: string]: any
}


export default function useUnidades(materialId?: number | string) {
  const id = parseId(materialId)
  const url = id ? `/api/materiales/${id}/unidades` : null

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  const registrar = async (descripcion: string, cantidad = 1) => {
    if (Number.isNaN(id) || id <= 0) return
    try {
      const res = await apiFetch(`/api/materiales/${id}/historial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, cantidad }),
      })
      return await jsonOrNull(res)
    } catch {
      return { error: 'Error de red' }
    }
  }

  const crear = async (datos: Partial<Unidad> & { nombre: string }) => {
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    try {
      const payload: any = { ...datos }
      if (datos.imagen && datos.imagen instanceof File) {
        payload.imagen = await fileToBase64(datos.imagen)
        payload.imagenNombre = datos.imagen.name
      }
      const res = await apiFetch(`/api/materiales/${id}/unidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanPayload(payload)),
      })
      const result = await jsonOrNull(res)
      if (res.ok) {
        const unidad = result?.unidad as Unidad | undefined
        if (datos.archivos && unidad?.id) {
          await Promise.all(
            datos.archivos.map(async (f) => {
              const fd = new FormData()
              fd.append('nombre', f.name)
              fd.append('archivo', f)
              await apiFetch(`/api/materiales/${id}/unidades/${unidad.id}/archivos`, {
                method: 'POST',
                body: fd,
              })
            }),
          )
        }
        mutate()
        registrar(`Entrada - ${datos.nombre} (unidad ${unidad?.id ?? ''})`)
        if (result?.auditoria?.id) {
          window.dispatchEvent(new CustomEvent(AUDIT_PREVIEW_EVENT, { detail: true }))
        }
      }
      return result
    } catch {
      return { error: 'Error de red' }
    }
  }

  const actualizar = async (unidad: Partial<Unidad> & { id: number }) => {
    if (!unidad.id) return { error: 'ID requerido' }
    const { id: uid, ...payload } = unidad
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    try {
      if (payload.imagen && payload.imagen instanceof File) {
        ;(payload as any).imagen = await fileToBase64(payload.imagen)
        ;(payload as any).imagenNombre = payload.imagen.name
      }
      const res = await apiFetch(`/api/materiales/${id}/unidades/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanPayload(payload)),
      })
      const result = await jsonOrNull(res)
      if (res.ok) {
        if (payload.archivos && payload.archivos.length) {
          await Promise.all(
            payload.archivos.map(async (f: File) => {
              const fd = new FormData()
              fd.append('nombre', f.name)
              fd.append('archivo', f)
              await apiFetch(`/api/materiales/${id}/unidades/${uid}/archivos`, {
                method: 'POST',
                body: fd,
              })
            }),
          )
        }
        mutate()
        registrar(`Modificacion - ${payload.nombre ?? ''} (unidad ${uid})`)
        if (result?.auditoria?.id) {
          window.dispatchEvent(new CustomEvent(AUDIT_PREVIEW_EVENT, { detail: true }))
        }
      }
      return result
    } catch {
      return { error: 'Error de red' }
    }
  }

  const eliminar = async (unidadId: number) => {
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    if (Number.isNaN(unidadId) || unidadId <= 0)
      return { error: 'ID de unidad inválido' }
    try {
      const res = await apiFetch(`/api/materiales/${id}/unidades/${unidadId}`, {
        method: 'DELETE',
      })
      const result = await jsonOrNull(res)
      if (res.ok) {
        mutate()
        registrar(`Eliminacion - unidad ${unidadId}`)
        if (result?.auditoria?.id) {
          window.dispatchEvent(new CustomEvent(AUDIT_PREVIEW_EVENT, { detail: true }))
        }
      }
      return result
    } catch {
      return { error: 'Error de red' }
    }
  }

  const obtener = async (unidadId: number) => {
    if (Number.isNaN(id) || id <= 0) return undefined
    try {
      const res = await apiFetch(`/api/materiales/${id}/unidades/${unidadId}`)
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
        if (Array.isArray(unidad.archivos)) {
          unidad.archivos = unidad.archivos.map(a => ({
            ...a,
            fecha: a.fecha ? new Date(a.fecha).toISOString() : a.fecha,
          }))
        }
      }
      return unidad
    } catch {
      return undefined
    }
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
