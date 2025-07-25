import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import DocumentosPage from '../src/app/docs/page'

;(global as any).React = React

describe('DocumentosPage descargas', () => {
  it('renderiza enlaces a manuales', () => {
    const html = renderToStaticMarkup(<DocumentosPage />)
    expect(html).toContain('/manuales/manual-usuario.pdf')
    expect(html).toContain('/manuales/referencia-tecnica.pdf')
  })
})
