import { describe, it, expect } from 'vitest'
import { computeBoardLayout } from '../lib/boardLayout'

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
})
