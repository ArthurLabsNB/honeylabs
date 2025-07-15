import { describe, it, expect } from 'vitest'
import { computeBoardLayout, compactLayout } from '../lib/boardLayout'

// ensures cards without explicit y use cumulative height

describe('computeBoardLayout', () => {
  it('incrementa posiciones verticales segun h', () => {
    const tabs = [
      { id: 'a', boardId: 'x', side: 'left', h: 2 } as any,
      { id: 'b', boardId: 'x', side: 'left', h: 3 } as any
    ]
    const layout = computeBoardLayout(tabs)
    expect(layout[0].y).toBe(0)
    expect(layout[1].y).toBe(2)
  })

  it('maneja lados separados', () => {
    const tabs = [
      { id: 'a', boardId: 'x', side: 'right', h: 2 } as any,
      { id: 'b', boardId: 'x', side: 'left', h: 1 } as any,
      { id: 'c', boardId: 'x', side: 'right', h: 1 } as any
    ]
    const layout = computeBoardLayout(tabs)
    const byId = Object.fromEntries(layout.map(l => [l.i, l]))
    expect(byId.a.y).toBe(0)
    expect(byId.c.y).toBe(2)
    expect(byId.b.y).toBe(0)
  })

  it('compacta huecos en el layout', () => {
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 1 },
      { i: 'b', x: 0, y: 3, w: 1, h: 1 }
    ]
    const res = compactLayout(layout)
    const byId = Object.fromEntries(res.map(l => [l.i, l]))
    expect(byId.b.y).toBe(1)
  })

  it('computeBoardLayout aplica compactacion', () => {
    const tabs = [
      { id: 'a', boardId: 'x', side: 'left', y: 0 } as any,
      { id: 'b', boardId: 'x', side: 'left', y: 3 } as any
    ]
    const layout = computeBoardLayout(tabs)
    const byId = Object.fromEntries(layout.map(l => [l.i, l]))
    expect(byId.b.y).toBe(1)
  })
})
