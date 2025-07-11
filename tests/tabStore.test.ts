import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTabStore } from '../src/hooks/useTabs'

beforeEach(() => {
  const storage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
  useTabStore.setState({ tabs: [], activeId: null })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useTabStore', () => {
  it('adds and activates tabs', () => {
    useTabStore.getState().add({ id: '1', title: 't1', type: 'materiales' })
    const state = useTabStore.getState()
    expect(state.tabs.length).toBe(1)
    expect(state.activeId).toBe('1')
  })

  it('moves tabs', () => {
    const store = useTabStore.getState()
    store.add({ id: 'a', title: 'A', type: 'materiales' })
    store.add({ id: 'b', title: 'B', type: 'unidades' })
    store.move(1, 0)
    expect(useTabStore.getState().tabs[0].id).toBe('b')
  })
})
