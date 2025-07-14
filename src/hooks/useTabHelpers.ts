import { useCallback } from 'react'
import { useTabStore, TabType } from './useTabs'
import { generarUUID } from '@/lib/uuid'

export function useTabHelpers() {
  const { tabs, addAfterActive, setActive, update } = useTabStore()

  const ensureTab = useCallback(
    (type: TabType, title: string, side: 'left' | 'right') => {
      const existing = tabs.find(t => t.type === type)
      if (existing) setActive(existing.id)
      else addAfterActive({ id: generarUUID(), title, type, side })
    },
    [tabs, addAfterActive, setActive]
  )

  const openForm = useCallback(
    (type: 'form-material' | 'form-unidad', title: string) => {
      const form = tabs.find(t => t.type === 'form-material' || t.type === 'form-unidad')
      if (form) {
        update(form.id, { type, title, side: 'left' })
        setActive(form.id)
      } else {
        addAfterActive({ id: generarUUID(), title, type, side: 'left' })
      }
    },
    [tabs, addAfterActive, setActive, update]
  )

  return { ensureTab, openForm }
}
