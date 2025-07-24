import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import MaterialCodes from '../src/app/dashboard/almacenes/components/MaterialCodes'

;(global as any).React = React

describe('MaterialCodes', () => {
  it('avisa cuando el payload supera el límite', () => {
    const value = 'x'.repeat(2100)
    const html = renderToStaticMarkup(<MaterialCodes value={value} />)
    expect(html).toContain('versión resumida')
  })

  it('omite aviso con datos cortos', () => {
    const value = 'y'.repeat(100)
    const html = renderToStaticMarkup(<MaterialCodes value={value} />)
    expect(html).not.toContain('versión resumida')
  })
})
