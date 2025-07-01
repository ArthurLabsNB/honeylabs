import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'

export interface ArchivoInfo {
  id: number
  nombre: string
  archivoNombre: string
  fecha?: string
}


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
