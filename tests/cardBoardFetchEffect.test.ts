import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { apiFetch } from '../lib/api'
import { jsonOrNull } from '../lib/http'
import type { Tab } from '../src/hooks/useTabs'


describe('cambio rapido de tablero', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })
  it('mantiene tabs del ultimo tablero', async () => {
    const layouts = {
      b1: [{ id: 'a', boardId: 'b1', title: 'A', type: 'materiales' } as Tab],
      b2: [{ id: 'b', boardId: 'b2', title: 'B', type: 'materiales' } as Tab],
    }
    let call = 0
    global.fetch = vi.fn().mockImplementation(() => {
      const delay = call++ === 0 ? 50 : 10
      return new Promise(res =>
        setTimeout(
          () =>
            res(
              new Response(JSON.stringify(layouts), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            ),
          delay,
        ),
      )
    })

    let boardId = ''
    let tabs: Tab[] = []
    let controller: AbortController | undefined
    const setTabs = (updater: (prev: Tab[]) => Tab[]) => {
      tabs = updater(tabs)
    }

    const runEffect = (id: string) => {
      boardId = id
      if (!boardId) return
      controller?.abort()
      controller = new AbortController()
      const currentBoardId = boardId
      apiFetch('/api/dashboard/layout', { signal: controller.signal })
        .then(jsonOrNull)
        .then(d => {
          if (currentBoardId !== boardId) return
          if (d && typeof d === 'object') {
            const boardTabs = (d[currentBoardId] as Tab[]) ?? []
            setTabs(prev => {
              const map = new Map(prev.map(t => [t.id, t]))
              boardTabs.forEach(tab => {
                const prevTab = map.get(tab.id)
                map.set(tab.id, { ...prevTab, ...tab })
              })
              return Array.from(map.values())
            })
          }
        })
        .catch(() => {})
    }

    runEffect('b1')
    runEffect('b2')
    await vi.runAllTimersAsync()
    expect(tabs[0].boardId).toBe('b2')
  })

  it('conserva estado collapsed local al fusionar', async () => {
    const layouts = {
      b1: [{ id: 'a', boardId: 'b1', title: 'A', type: 'materiales' } as Tab],
    }
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(layouts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    let boardId = 'b1'
    let tabs: Tab[] = [
      { id: 'a', boardId: 'b1', title: 'A', type: 'materiales', collapsed: true } as Tab,
    ]
    let controller: AbortController | undefined
    const setTabs = (updater: (prev: Tab[]) => Tab[]) => {
      tabs = updater(tabs)
    }

    const runEffect = () => {
      controller?.abort()
      controller = new AbortController()
      const currentBoardId = boardId
      apiFetch('/api/dashboard/layout', { signal: controller.signal })
        .then(jsonOrNull)
        .then(d => {
          if (currentBoardId !== boardId) return
          if (d && typeof d === 'object') {
            const boardTabs = (d[currentBoardId] as Tab[]) ?? []
            setTabs(prev => {
              const map = new Map(prev.map(t => [t.id, t]))
              boardTabs.forEach(tab => {
                const prevTab = map.get(tab.id)
                map.set(tab.id, { ...prevTab, ...tab })
              })
              return Array.from(map.values())
            })
          }
        })
        .catch(() => {})
    }

    runEffect()
    await Promise.resolve()
    expect(tabs[0].collapsed).toBe(true)
  })
})
