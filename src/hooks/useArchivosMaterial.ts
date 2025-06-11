import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface ArchivoInfo {
  id: number
  nombre: string
  archivoNombre: string
  fecha?: string
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useArchivosMaterial(materialId?: number) {
  const id = Number(materialId)
  const url = !Number.isNaN(id) && id > 0 ? `/api/materiales/${id}/archivos` : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  const eliminar = async (archivoId: number) => {
    if (!url) return
    await fetch(`/api/materiales/${id}/archivos/${archivoId}`, { method: 'DELETE' })
    mutate()
  }

  return {
    archivos: (data?.archivos as ArchivoInfo[]) ?? [],
    loading: isLoading,
    error,
    eliminar,
    mutate,
  }
}
