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

describe('persistencia por tablero', () => {
  it('mantiene tarjetas al cambiar y recargar', () => {
    const layoutA = [{ i: 'a', x: 1, y: 0, w: 1, h: 1 }]
    const layoutB = [{ i: 'b', x: 0, y: 1, w: 1, h: 1 }]
    ;(localStorage.getItem as any).mockImplementation((key: string) => {
      if (key === 'card-layout-b1') return JSON.stringify(layoutA)
      if (key === 'card-layout-b2') return JSON.stringify(layoutB)
      return null
    })

    let tabs = [
      { id: 'a', boardId: 'b1', title: 'A', type: 'materiales', x: 0, y: 0 } as any,
      { id: 'b', boardId: 'b2', title: 'B', type: 'materiales', x: 0, y: 0 } as any,
    ]

    // tablero b1
    const storedA = JSON.parse(localStorage.getItem('card-layout-b1') as string)
    tabs = applyLayout(tabs, compactLayout(storedA))
    expect(tabs.find(t => t.id === 'a')?.x).toBe(1)

    // cambio a b2
    const storedB = JSON.parse(localStorage.getItem('card-layout-b2') as string)
    tabs = applyLayout(tabs, compactLayout(storedB))
    expect(tabs.find(t => t.id === 'b')?.y).toBe(0)

    // recarga y regreso a b1
    const reloadA = JSON.parse(localStorage.getItem('card-layout-b1') as string)
    tabs = applyLayout(tabs, compactLayout(reloadA))
    expect(tabs.find(t => t.id === 'a')?.x).toBe(1)
  })

  it('reaplica posiciones tras recargar de servidor', () => {
    const layoutA = [{ i: 'a', x: 1, y: 0, w: 1, h: 1 }]
    const layoutB = [{ i: 'b', x: 0, y: 1, w: 1, h: 1 }]
    ;(localStorage.getItem as any).mockImplementation((key: string) => {
      if (key === 'card-layout-b1') return JSON.stringify(layoutA)
      if (key === 'card-layout-b2') return JSON.stringify(layoutB)
      return null
    })

    // carga inicial desde API reemplaza posiciones
    let tabs = [{ id: 'a', boardId: 'b1', title: 'A', type: 'materiales', x: 0, y: 0 } as any]
    const storedA = JSON.parse(localStorage.getItem('card-layout-b1') as string)
    tabs = applyLayout(tabs, compactLayout(storedA))
    expect(tabs.find(t => t.id === 'a')?.x).toBe(1)

    // cambio a b2 con datos remotos nuevos
    tabs = [{ id: 'b', boardId: 'b2', title: 'B', type: 'materiales', x: 0, y: 0 } as any]
    const storedB = JSON.parse(localStorage.getItem('card-layout-b2') as string)
    tabs = applyLayout(tabs, compactLayout(storedB))
    expect(tabs.find(t => t.id === 'b')?.y).toBe(0)

    // regreso a b1 con tabs recargadas sin posiciones
    tabs = [{ id: 'a', boardId: 'b1', title: 'A', type: 'materiales', x: 0, y: 0 } as any]
    const reloadA = JSON.parse(localStorage.getItem('card-layout-b1') as string)
    tabs = applyLayout(tabs, compactLayout(reloadA))
    expect(tabs.find(t => t.id === 'a')?.x).toBe(1)
  })
})
