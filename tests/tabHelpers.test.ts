import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { Tab } from '../src/hooks/useTabs'
import type { Board } from '../src/hooks/useBoards'

vi.mock('react', () => ({ useCallback: (fn: any) => fn }))

const tabs: Tab[] = []
let activeBoard = 'b1'
const boards: Board[] = [{ id: 'b1', title: 'B1' }]

const mockTabStore = {
  tabs,
  addAfterActive: vi.fn((tab: Tab) => { tabs.push(tab) }),
  setActive: vi.fn(),
  update: vi.fn((id: string, data: Partial<Tab>) => {
    const idx = tabs.findIndex(t => t.id === id)
    if (idx >= 0) tabs[idx] = { ...tabs[idx], ...data }
  }),
}

const mockBoardStore = {
  get activeId() { return activeBoard },
  add: (b: Board) => { boards.push(b); activeBoard = b.id },
  setActive: (id: string) => { activeBoard = id },
}

vi.mock('../src/hooks/useTabs', async () => {
  const mod: any = await vi.importActual('../src/hooks/useTabs')
  return { ...mod, useTabStore: () => mockTabStore }
})

vi.mock('../src/hooks/useBoards', async () => {
  const mod: any = await vi.importActual('../src/hooks/useBoards')
  return { ...mod, useBoardStore: () => mockBoardStore }
})

import { useTabHelpers } from '../src/hooks/useTabHelpers'

beforeEach(() => {
  tabs.length = 0
  activeBoard = 'b1'
  boards.length = 1
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useTabHelpers', () => {
  it('crea tabs por tablero', () => {
    let { ensureTab } = useTabHelpers()
    ensureTab('materiales', 'Materiales', 'left')
    expect(tabs[0]).toMatchObject({ type: 'materiales', boardId: 'b1', side: 'left' })

    mockBoardStore.add({ id: 'b2', title: 'B2' })
    mockBoardStore.setActive('b2')
    ;({ ensureTab } = useTabHelpers())
    ensureTab('materiales', 'Materiales', 'right')
    const second = tabs.find(t => t.boardId === 'b2' && t.type === 'materiales')
    expect(second).toBeTruthy()
    expect(second?.side).toBe('right')
  })

  it('abre formularios por tablero', () => {
    let { openForm } = useTabHelpers()
    openForm('form-material', 'Material')
    openForm('form-unidad', 'Unidad')
    const formsB1 = tabs.filter(t => t.boardId === 'b1')
    expect(formsB1.length).toBe(1)
    expect(formsB1[0].type).toBe('form-unidad')
    expect(formsB1[0].side).toBe('left')
    expect(formsB1[0].x).toBeUndefined()
    expect(formsB1[0].y).toBeUndefined()

    mockBoardStore.add({ id: 'b2', title: 'B2' })
    mockBoardStore.setActive('b2')
    ;({ openForm } = useTabHelpers())
    openForm('form-material', 'Material')
    const formB2 = tabs.find(t => t.boardId === 'b2')
    expect(formB2).toBeTruthy()
    expect(formB2?.side).toBe('left')
    expect(formB2?.x).toBeUndefined()
    expect(formB2?.y).toBeUndefined()
  })
})
