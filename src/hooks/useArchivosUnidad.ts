import useSWR from 'swr'
import { jsonOrNull } from '@lib/http'

export interface ArchivoInfo {
  id: number
  nombre: string
  archivoNombre: string
  fecha?: string
}

const fetcher = (url: string) => fetch(url).then(jsonOrNull)

export default function useArchivosUnidad(materialId?: number, unidadId?: number) {
  const mid = Number(materialId)
  const uid = Number(unidadId)
  const url =
    !Number.isNaN(mid) && mid > 0 && !Number.isNaN(uid) && uid > 0
      ? `/api/materiales/${mid}/unidades/${uid}/archivos`
      : null
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  const eliminar = async (archivoId: number) => {
    if (!url) return
    await fetch(`/api/materiales/${mid}/unidades/${uid}/archivos/${archivoId}`, {
      method: 'DELETE',
    })
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
