// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ScanInfo from '../src/app/dashboard/inventario/ScanInfo'

;(global as any).React = React

describe('ScanInfo', () => {
  it('muestra titulo segun tipo', () => {
    const html = renderToStaticMarkup(
      <ScanInfo info={{ tipo: 'almacen', almacen: { id: 1, nombre: 'A' } }} />
    )
    expect(html).toContain('Almacén')
    expect(html).toContain('nombre')
  })
})
