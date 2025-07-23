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


  it('renames a tab', () => {
    const store = useTabStore.getState()
    store.add({ id: 'x', title: 'Old', type: 'materiales' })
    store.rename('x', 'New')
    expect(useTabStore.getState().tabs[0].title).toBe('New')
  })


})
