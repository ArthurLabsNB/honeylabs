import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import DraggableCard from '../src/app/dashboard/almacenes/components/DraggableCard'
import type { Tab } from '../src/hooks/useTabs'

describe('DraggableCard', () => {
  it('no incluye manejadores de redimension', () => {
    const tab = { id: 't1', title: 'demo', type: 'test' } as Tab
    const html = renderToStaticMarkup(<DraggableCard tab={tab} />)
    const matches = html.match(/react-resizable-handle-(?:se|sw|ne|nw)/g) || []
    expect(matches.length).toBe(0)
  })

  it('usa h-full en modo grid', () => {
    const tab = { id: 't2', title: 'demo', type: 'test' } as Tab
    const html = renderToStaticMarkup(<DraggableCard tab={tab} grid />)
    expect(html.includes('h-full')).toBe(true)
  })
})
