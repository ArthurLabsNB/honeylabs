import { useCallback } from 'react'
import { useTabStore, TabType } from './useTabs'
import { useBoardStore } from './useBoards'
import { generarUUID } from '@/lib/uuid'

export function useTabHelpers() {
  const { tabs, addAfterActive, setActive, update } = useTabStore()
  const { activeId } = useBoardStore()

  const ensureTab = useCallback(
    (type: TabType, title: string, side: 'left' | 'right') => {
      const existing = tabs.find(t => t.type === type && t.boardId === activeId)
      if (existing) setActive(existing.id)
      else addAfterActive({ id: generarUUID(), title, type, boardId: activeId, side })
    },
    [tabs, addAfterActive, setActive, activeId]
  )

  const openForm = useCallback(
    (type: 'form-material' | 'form-unidad', title: string) => {
      const form = tabs.find(
        t => (t.type === 'form-material' || t.type === 'form-unidad') && t.boardId === activeId
      )
      if (form) {
        update(form.id, {
          type,
          title,
          side: 'left',
          x: undefined,
          y: undefined,
          collapsed: false,
          h: 3,
        })
        setActive(form.id)
      } else {
        addAfterActive({
          id: generarUUID(),
          title,
          type,
          side: 'left',
          boardId: activeId,
          x: undefined,
          y: undefined,
          collapsed: false,
          h: 3,
        })
      }
    },
    [tabs, addAfterActive, setActive, update, activeId]
  )

  return { ensureTab, openForm }
}
