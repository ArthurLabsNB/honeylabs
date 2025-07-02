import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'
import fetcher from '@lib/swrFetcher'
import { apiFetch } from '@lib/api'

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


export default function useUnidades(materialId?: number | string) {
  const id = Number(materialId)
  const url = !Number.isNaN(id) && id > 0 ? `/api/materiales/${id}/unidades` : null

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
      return null
    }
  }

  const crear = async (datos: Partial<Unidad> & { nombre: string }) => {
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    const payload: any = { ...datos }
    if (datos.imagen && datos.imagen instanceof File) {
      payload.imagen = await fileToBase64(datos.imagen)
      payload.imagenNombre = datos.imagen.name
    }
    const res = await apiFetch(`/api/materiales/${id}/unidades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
    }
    return result
  }

  const actualizar = async (unidad: Partial<Unidad> & { id: number }) => {
    if (!unidad.id) return { error: 'ID requerido' }
    const { id: uid, ...payload } = unidad
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    if (payload.imagen && payload.imagen instanceof File) {
      ;(payload as any).imagen = await fileToBase64(payload.imagen)
      ;(payload as any).imagenNombre = payload.imagen.name
    }
    const res = await apiFetch(`/api/materiales/${id}/unidades/${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
    }
    return result
  }

  const eliminar = async (unidadId: number) => {
    if (Number.isNaN(id) || id <= 0) return { error: 'ID inválido' }
    if (Number.isNaN(unidadId) || unidadId <= 0)
      return { error: 'ID de unidad inválido' }
    const res = await apiFetch(`/api/materiales/${id}/unidades/${unidadId}`, {
      method: 'DELETE',
    })
    const result = await jsonOrNull(res)
    if (res.ok) {
      mutate()
      registrar(`Eliminacion - unidad ${unidadId}`)
    }
    return result
  }

  const obtener = async (unidadId: number) => {
    if (Number.isNaN(id) || id <= 0) return undefined
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
