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

  it('renames a tab', () => {
    const store = useTabStore.getState()
    store.add({ id: 'x', title: 'Old', type: 'materiales' })
    store.rename('x', 'New')
    expect(useTabStore.getState().tabs[0].title).toBe('New')
  })

  it('adds after active and closes others', () => {
    const store = useTabStore.getState()
    store.add({ id: 'a', title: 'A', type: 'materiales' })
    store.addAfterActive({ id: 'b', title: 'B', type: 'unidades' })
    const state = useTabStore.getState()
    expect(state.tabs[1].id).toBe('b')
    expect(state.activeId).toBe('b')
    store.closeOthers('b')
    expect(useTabStore.getState().tabs.length).toBe(1)
    expect(useTabStore.getState().tabs[0].id).toBe('b')
  })

  it('handles invalid stored tabs', () => {
    useTabStore.setState({ tabs: {} as any, activeId: null } as any)
    useTabStore.getState().addAfterActive({ id: '1', title: 'T', type: 'materiales' })
    const state = useTabStore.getState()
    expect(Array.isArray(state.tabs)).toBe(true)
    expect(state.tabs.length).toBe(1)
  })
})
