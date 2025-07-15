import { useCallback } from 'react'
import { useTabStore, type TabType, type Tab } from './useTabs'
import { useBoardStore } from './useBoards'
import { useToast } from '@/components/Toast'
import { generarUUID } from '@/lib/uuid'
import { usePrompt } from './usePrompt'

interface Options {
  defaultLayout?: Pick<Tab, 'x' | 'y' | 'w' | 'h'>
}

export function useCreateTab(options?: Options) {
  const { addAfterActive } = useTabStore()
  const { activeId: boardId, boards } = useBoardStore()
  const toast = useToast()
  const prompt = usePrompt()

  const create = useCallback(
    async (type: TabType, label: string) => {
      if (!boardId) {
        toast.show('Crea una pestaña primero', 'error')
        return
      }
      const id = generarUUID()
      let title = label
      const extra: Partial<Tab> = { boardId }
      if (type === 'url') {
        const url = await prompt('URL de destino')
        if (!url) return
        extra.url = url
        title = url
      } else if (type === 'board') {
        const board = await prompt('Tablero destino')
        if (!board) return
        extra.boardId = board
        title = board
      }
      addAfterActive({
        id,
        title,
        type,
        side: 'left',
        ...options?.defaultLayout,
        ...extra,
      })
    },
    [boardId, toast, addAfterActive, prompt, options]
  )

  const disabled = !boardId || boards.length === 0

  return { create, disabled }
}

