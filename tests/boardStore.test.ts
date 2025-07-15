import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
let useBoardStore: typeof import('../src/hooks/useBoards').useBoardStore
let ensureBoardsHydrated: typeof import('../src/hooks/useBoards').ensureBoardsHydrated

beforeEach(async () => {
  vi.resetModules()
  const storage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
  ;(globalThis as any).window = {}
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response('{"boards":[{"id":"a","title":"A"}],"activeId":"a"}', { status: 200, headers: { 'Content-Type': 'application/json' } })
    )
  )
  ;({ useBoardStore, ensureBoardsHydrated } = await import('../src/hooks/useBoards'))
  await Promise.resolve()
})

afterEach(() => {
  vi.restoreAllMocks()
  ;(globalThis as any).window = undefined
})

describe('useBoardStore', () => {
  it('initializes with data from api', async () => {
    await new Promise(r => setTimeout(r, 0))
    const state = useBoardStore.getState()
    expect(state.boards[0].id).toBe('a')
  })
  it('adds boards and sets active', async () => {
    const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockClear()
    useBoardStore.getState().add({ id: '1', title: 'b1' })
    await new Promise(r => setTimeout(r, 0))
    const call = fetchMock.mock.calls.find(c => (c[1] as RequestInit).method === 'POST')
    expect(call).toBeTruthy()
  })
})
