import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface ArchivoInfo {
  id: number
  nombre: string
  archivoNombre: string
  fecha?: string
}


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
