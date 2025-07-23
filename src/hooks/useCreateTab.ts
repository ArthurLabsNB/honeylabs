import { useCallback } from 'react'
import { useTabStore, type TabType, type Tab } from './useTabs'
import { useBoardStore } from './useBoards'
import { useToast } from '@/components/Toast'
import { generarUUID } from '@/lib/uuid'
import { usePrompt } from './usePrompt'
import { tabConfig } from '@/app/dashboard/almacenes/components/tabOptions'

interface Options {
  defaultLayout?: Pick<Tab, 'x' | 'y' | 'w' | 'h'>
}

export function useCreateTab(options?: Options) {
  const { add } = useTabStore()
  const { activeId: boardId } = useBoardStore()
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
      add({
        id,
        title,
        type,
        side: 'left',
        ...options?.defaultLayout,
        h: tabConfig[type]?.defaultH,
        ...extra,
      })
    },
    [boardId, toast, add, prompt, options]
  )

  const disabled = !boardId

  return { create, disabled }
}

