// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
(global as any).React = React

const toast = { show: vi.fn() }
vi.mock('../src/components/Toast', () => ({ useToast: () => toast }))

import InventarioErrorBoundary from '../src/components/InventarioErrorBoundary'

function Boom() {
  throw new Error('boom')
}

describe('InventarioErrorBoundary', () => {
  it('muestra mensaje y notifica', () => {
    const { getByText } = render(
      <InventarioErrorBoundary>
        <Boom />
      </InventarioErrorBoundary>
    )
    expect(getByText(/Error en inventario/)).toBeTruthy()
    expect(toast.show).toHaveBeenCalledWith('boom', 'error')
  })
})
