import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { API_BUILD_PROGRESS } from '@lib/apiPaths'
import type { AppInfo } from '@/types/app'

export default function useBuildProgress(building: boolean) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!building) return
    let retry = 1
    let es: EventSource
    const connect = () => {
      es = new EventSource(API_BUILD_PROGRESS)
      es.addEventListener('open', () => {
        retry = 1
      })
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as Partial<AppInfo>
          qc.setQueryData(['app'], (prev: AppInfo | undefined) =>
            prev ? { ...prev, ...data } : undefined,
          )
        } catch {}
      }
      es.onerror = () => {
        es.close()
        setTimeout(connect, retry * 1000)
        retry = Math.min(retry * 2, 30)
      }
    }
    connect()
    return () => {
      es.close()
    }
  }, [building, qc])
}
