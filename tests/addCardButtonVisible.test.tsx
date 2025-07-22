// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AddCardButton from '../src/app/dashboard/almacenes/components/AddCardButton'

(global as any).React = React

describe('AddCardButton', () => {
  it('permanece visible con contenedor bajo', () => {
    const { getByTitle } = render(
      <div style={{ height: '50px', overflow: 'auto' }}>
        <AddCardButton />
      </div>
    )
    const btn = getByTitle('Añadir tarjeta')
    expect(btn.className.includes('fixed')).toBe(true)
    fireEvent.click(btn)
    const item = document.querySelector('div.absolute')
    expect(item).toBeTruthy()
  })
})
