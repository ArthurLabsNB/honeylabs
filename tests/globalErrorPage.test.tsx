// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'

;(global as any).React = React

import GlobalError from '../src/app/error'

describe('GlobalError page', () => {
  it('muestra mensaje y acciones', () => {
    const { getByText } = render(
      <GlobalError error={new Error('fail')} reset={vi.fn()} />
    )
    expect(getByText(/algo salió mal/i)).toBeTruthy()
    expect(getByText(/volver al inicio/i)).toBeTruthy()
    expect(getByText(/reintentar/i)).toBeTruthy()
  })
})
