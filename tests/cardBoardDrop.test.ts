import { describe, it, expect } from 'vitest'
import { computeBoardLayout } from '../lib/boardLayout'

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const copy = arr.slice()
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

describe('drag and drop', () => {
  it('reordena tarjetas al soltar', () => {
    const tabs = [
      { id: 'a', boardId: 'x', side: 'left', h: 1 } as any,
      { id: 'b', boardId: 'x', side: 'left', h: 1 } as any,
      { id: 'c', boardId: 'x', side: 'left', h: 1 } as any,
    ]
    const layout = computeBoardLayout(tabs)
    expect(layout.map(l => l.i)).toEqual(['a','b','c'])
    const moved = arrayMove(tabs, 0, 2)
    const after = computeBoardLayout(moved)
    expect(after.map(l => l.i)).toEqual(['b','c','a'])
  })
})

