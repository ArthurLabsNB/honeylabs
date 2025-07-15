import type { Layout } from 'react-grid-layout'
import type { Tab } from '@/hooks/useTabs'

export type { Layout } from 'react-grid-layout'

export function computeBoardLayout(tabs: Tab[]): Layout[] {
  let leftY = 0
  let rightY = 0

  const layout = tabs.map(t => {
    const x = typeof t.x === 'number' ? t.x : (t.side === 'right' ? 1 : 0)
    const h = t.h ?? 1

    const y = typeof t.y === 'number'
      ? t.y
      : (t.side === 'right' ? rightY : leftY)

    if (typeof t.y !== 'number') {
      if (t.side === 'right') rightY += h
      else leftY += h
    }

    return { i: t.id, x, y, w: t.w ?? 1, h }
  })

  return compactLayout(layout)
}

export function compactLayout(layout: Layout[]): Layout[] {
  const byColumn = new Map<number, Layout[]>()
  layout.forEach(l => {
    const arr = byColumn.get(l.x) ?? []
    arr.push(l)
    byColumn.set(l.x, arr)
  })

  const result: Layout[] = []

  for (const [x, items] of byColumn.entries()) {
    let y = 0
    items
      .sort((a, b) => a.y - b.y)
      .forEach(it => {
        result.push({ ...it, x, y })
        y += it.h
      })
  }

  return result.sort((a, b) => a.x - b.x || a.y - b.y)
}
