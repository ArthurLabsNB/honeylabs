import useSWR from 'swr'
import fetcher from '@lib/swrFetcher'
import type { LayoutItem } from '@/types/panel'

export interface Panel {
  id: string
  nombre?: string
  widgets?: string[]
  layout?: LayoutItem[]
  permiso?: string
  [key: string]: any
}

export default function usePanel(id?: string | number | null) {
  const panelId = id ? String(id) : null
  const { data, error, isLoading, mutate } = useSWR(
    panelId ? `/api/paneles/${panelId}` : null,
    fetcher,
    {
      dedupingInterval: 10000,
      revalidateOnFocus: false,
    }
  )

  return {
    panel: data?.panel as Panel | undefined,
    isLoading,
    error,
    mutate,
  }
}
