import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useBoardStore } from '../src/hooks/useBoards'
import * as uuidFns from '../src/lib/uuid'

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

  it('removes boards and keeps at least one', () => {
    const store = useBoardStore.getState()
    store.add({ id: 'x', title: 'X' })
    store.remove('x')
    const state = useBoardStore.getState()
    expect(state.boards.length).toBe(1)
    expect(state.activeId).toBe(state.boards[0].id)
  })

  it('duplicates board next to original', () => {
    const store = useBoardStore.getState()
    store.add({ id: 'a', title: 'A' })
    vi.spyOn(uuidFns, 'generarUUID').mockReturnValue('copy')
    store.duplicate('a')
    const state = useBoardStore.getState()
    expect(state.boards[1].id).toBe('copy')
    expect(state.activeId).toBe('copy')
  })
})

