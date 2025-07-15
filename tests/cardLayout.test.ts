import { describe, it, expect, beforeEach, vi } from 'vitest'
import { applyLayout } from '../src/hooks/useCardLayout'
import { compactLayout } from '../lib/boardLayout'

beforeEach(() => {
  const storage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
})

describe('useCardLayout', () => {
  it('actualiza posiciones desde layout', () => {
    const tabs = [{ id: 'a', title: 'A', type: 'materiales' } as any]
    const layout = [{ i: 'a', x: 1, y: 2, w: 1, h: 1 }]
    const updated = applyLayout(tabs, layout as any)
    expect(updated[0].x).toBe(1)
  })

  it('restaura el orden con datos remotos', () => {
    const tabs = [
      { id: 'a', title: 'A', type: 'materiales', x: 0, y: 0 } as any,
      { id: 'b', title: 'B', type: 'materiales', x: 0, y: 1 } as any,
    ]
    const remote = [
      { i: 'a', x: 2, y: 0, w: 1, h: 1 },
      { i: 'b', x: 2, y: 1, w: 1, h: 1 },
    ]
    const updated = applyLayout(tabs, remote as any)
    expect(updated[0].x).toBe(2)
    expect(updated[1].y).toBe(1)
  })

  it('restaura el orden almacenado tras recargar', () => {
    const key = 'card-layout-x'
    const stored = [
      { i: 'a', x: 1, y: 0, w: 1, h: 1 },
      { i: 'b', x: 1, y: 1, w: 1, h: 1 },
    ]
    ;(localStorage.getItem as any).mockReturnValueOnce(JSON.stringify(stored))

    const tabs = [
      { id: 'a', boardId: 'x', title: 'A', type: 'materiales', x: 0, y: 2 } as any,
      { id: 'b', boardId: 'x', title: 'B', type: 'materiales', x: 0, y: 3 } as any,
    ]

    const raw = localStorage.getItem(key) as string
    const data = JSON.parse(raw)
    const updated = applyLayout(tabs, compactLayout(data))

    expect(localStorage.getItem).toHaveBeenCalledWith(key)
    expect(updated[0].x).toBe(1)
    expect(updated[1].y).toBe(1)
  })
})
