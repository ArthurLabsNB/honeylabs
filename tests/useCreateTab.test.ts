import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { Tab } from '../src/hooks/useTabs'

vi.mock('react', () => ({ useCallback: (fn: any) => fn }))

const tabs: Tab[] = []
let boardId: string | null = 'b1'
const boards = [{ id: 'b1', title: 'B1' }]

const mockTabStore = {
  addAfterActive: vi.fn((tab: Tab) => { tabs.push(tab) }),
}
const mockBoardStore = {
  get activeId() { return boardId },
  get boards() { return boards },
}
const toast = { show: vi.fn() }
const prompt = vi.fn()

vi.mock('../src/hooks/useTabs', async () => {
  const mod: any = await vi.importActual('../src/hooks/useTabs')
  return { ...mod, useTabStore: () => mockTabStore }
})
vi.mock('../src/hooks/useBoards', async () => {
  const mod: any = await vi.importActual('../src/hooks/useBoards')
  return { ...mod, useBoardStore: () => mockBoardStore }
})
vi.mock('../src/components/Toast', () => ({ useToast: () => toast }))
vi.mock('../src/hooks/usePrompt', () => ({ usePrompt: () => prompt }))
vi.mock('../src/lib/uuid', () => ({ generarUUID: () => 'uid' }))

import { useCreateTab } from '../src/hooks/useCreateTab'

beforeEach(() => {
  tabs.length = 0
  boardId = 'b1'
  boards.length = 1
  toast.show.mockClear()
  prompt.mockReset()
  mockTabStore.addAfterActive.mockClear()
})

afterEach(() => {
  vi.resetModules()
})

describe('useCreateTab', () => {
  it('no crea si no hay tablero activo', async () => {
    boardId = null
    const { create, disabled } = useCreateTab()
    expect(disabled).toBe(true)
    await create('materiales', 'Mat')
    expect(toast.show).toHaveBeenCalled()
    expect(mockTabStore.addAfterActive).not.toHaveBeenCalled()
  })

  it('crea tabs con layout por defecto', async () => {
    const { create } = useCreateTab({ defaultLayout: { w: 1, h: 2 } })
    await create('unidades', 'Unid')
    expect(tabs[0]).toMatchObject({
      id: 'uid',
      title: 'Unid',
      type: 'unidades',
      boardId: 'b1',
      w: 1,
      h: 2,
    })
    expect(tabs[0].x).toBeUndefined()
    expect(tabs[0].y).toBeUndefined()
  })

  it('aplica x y iniciales si se proporcionan', async () => {
    const { create } = useCreateTab({ defaultLayout: { x: 1, y: 2, h: 1, w: 1 } })
    await create('materiales', 'Mat')
    expect(tabs[0]).toMatchObject({ x: 1, y: 2 })
  })

  it('solicita datos adicionales para url', async () => {
    prompt.mockResolvedValueOnce('http://test')
    const { create } = useCreateTab()
    await create('url', 'URL')
    expect(tabs[0]).toMatchObject({
      url: 'http://test',
      title: 'http://test',
      type: 'url',
    })
  })
})

