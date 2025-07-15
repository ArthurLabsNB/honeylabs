import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { computeBoardLayout, compactLayout } from '../lib/boardLayout'
import { useTabStore } from '../src/hooks/useTabs'
import { useBoardStore } from '../src/hooks/useBoards'
import { useTabHelpers } from '../src/hooks/useTabHelpers'
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
  add: vi.fn((tab: Tab) => { tabs.push(tab); mockTabStore.setActive(tab.id) }),
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

// ensures cards without explicit y use cumulative height

describe('computeBoardLayout', () => {
  it('incrementa posiciones verticales segun h', () => {
    const tabs = [
      { id: 'a', boardId: 'x', side: 'left', h: 2 } as any,
      { id: 'b', boardId: 'x', side: 'left', h: 3 } as any
    ]
    const layout = computeBoardLayout(tabs)
    expect(layout[0].y).toBe(0)
    expect(layout[1].y).toBe(2)
  })

  it('maneja lados separados', () => {
    const tabs = [
      { id: 'a', boardId: 'x', side: 'right', h: 2 } as any,
      { id: 'b', boardId: 'x', side: 'left', h: 1 } as any,
      { id: 'c', boardId: 'x', side: 'right', h: 1 } as any
    ]
    const layout = computeBoardLayout(tabs)
    const byId = Object.fromEntries(layout.map(l => [l.i, l]))
    expect(byId.a.y).toBe(0)
    expect(byId.c.y).toBe(2)
    expect(byId.b.y).toBe(0)
  })

  it('compacta huecos en el layout', () => {
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 1 },
      { i: 'b', x: 0, y: 3, w: 1, h: 1 }
    ]
    const res = compactLayout(layout)
    const byId = Object.fromEntries(res.map(l => [l.i, l]))
    expect(byId.b.y).toBe(1)
  })

  it('computeBoardLayout aplica compactacion', () => {
    const tabs = [
      { id: 'a', boardId: 'x', side: 'left', y: 0 } as any,
      { id: 'b', boardId: 'x', side: 'left', y: 3 } as any
    ]
    const layout = computeBoardLayout(tabs)
    const byId = Object.fromEntries(layout.map(l => [l.i, l]))
    expect(byId.b.y).toBe(1)
  })
})

describe('abrir unidad', () => {
  beforeEach(() => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(globalThis, 'localStorage', {
      value: storage,
      configurable: true,
    })
    tabs.length = 0
    activeBoard = 'b1'
    boards.length = 1
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('abre una unidad sin cerrar otras tarjetas', () => {
    const { openForm } = useTabHelpers()
    useTabStore().add({
      id: 'm1',
      title: 'Materiales',
      type: 'materiales',
      boardId: 'b1',
      side: 'left',
    })

    openForm('form-unidad', 'Unidad')

    const types = useTabStore().tabs.map(t => t.type)
    expect(types).toContain('materiales')
    expect(types).toContain('form-unidad')
  })
})
