// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AddCardButton from '../src/app/dashboard/almacenes/components/AddCardButton'
import { ToastProvider } from '../src/components/Toast'

(global as any).React = React

describe('AddCardButton', () => {
  it.skip('permanece visible con contenedor bajo', () => {
    const { getByTitle } = render(
      <ToastProvider>
        <div style={{ height: '50px', overflow: 'auto' }}>
          <AddCardButton />
        </div>
      </ToastProvider>
    )
    const btn = getByTitle('Añadir tarjeta')
    expect(btn.parentElement?.className.includes('fixed')).toBe(true)
    fireEvent.click(btn)
    const item = document.querySelector('div.absolute')
    expect(item).toBeTruthy()
  })
})
