// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'

;(global as any).React = React

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('EstadoPage', () => {
  it('muestra sistemas ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response('{"status":"ok"}', { status: 200, headers: { 'Content-Type': 'application/json' } })
    ))
    const { default: EstadoPage } = await import('../src/app/estado/page')
    const ui = await EstadoPage()
    const { getByText } = render(ui)
    expect(getByText(/funcionan normalmente/i)).toBeTruthy()
  })

  it('muestra mantenimiento', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response('{"status":"maintenance"}', { status: 503, headers: { 'Content-Type': 'application/json' } })
    ))
    const { default: EstadoPage } = await import('../src/app/estado/page')
    const ui = await EstadoPage()
    const { getByText } = render(ui)
    expect(getByText(/mantenimiento/i)).toBeTruthy()
  })
})
