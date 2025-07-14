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
})

