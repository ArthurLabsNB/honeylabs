import { useCallback } from 'react'
import { useTabStore, TabType } from './useTabs'
import { generarUUID } from '@/lib/uuid'

export function useTabHelpers() {
  const { tabs, addAfterActive, setActive } = useTabStore()

  const ensureTab = useCallback(
    (type: TabType, title: string, side: 'left' | 'right') => {
      const existing = tabs.find(t => t.type === type)
      if (existing) setActive(existing.id)
      else addAfterActive({ id: generarUUID(), title, type, side })
    },
    [tabs, addAfterActive, setActive]
  )

  return { ensureTab }
}
