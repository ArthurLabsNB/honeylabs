import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useBoardStore } from '../src/hooks/useBoards'

beforeEach(() => {
  const storage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
  useBoardStore.setState({ boards: [], activeId: null })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useBoardStore', () => {
  it('initializes empty', () => {
    const state = useBoardStore.getState()
    expect(state.boards.length).toBe(0)
    expect(state.activeId).toBeNull()
  })
  it('adds boards and sets active', () => {
    useBoardStore.getState().add({ id: '1', title: 'b1' })
    const state = useBoardStore.getState()
    expect(state.boards.length).toBe(1)
    expect(state.activeId).toBe('1')
  })

  it('moves boards', () => {
    const store = useBoardStore.getState()
    store.add({ id: 'a', title: 'A' })
    store.add({ id: 'b', title: 'B' })
    store.move(1, 0)
    expect(useBoardStore.getState().boards[0].id).toBe('b')
  })

  it('removes boards and keeps active consistent', () => {
    const store = useBoardStore.getState()
    store.add({ id: 'a', title: 'A' })
    store.add({ id: 'b', title: 'B' })
    store.remove('a')
    const state = useBoardStore.getState()
    expect(state.boards.length).toBe(1)
    expect(state.boards[0].id).toBe('b')
    expect(state.activeId).toBe('b')
  })

  it('duplicates boards', () => {
    const store = useBoardStore.getState()
    store.add({ id: 'x', title: 'X' })
    store.duplicate('x')
    const state = useBoardStore.getState()
    expect(state.boards.length).toBe(2)
    expect(state.activeId).not.toBe('x')
  })
})

