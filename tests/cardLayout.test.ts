import { describe, it, expect, beforeEach, vi } from 'vitest'
import { applyLayout } from '../src/hooks/useCardLayout'

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
})
