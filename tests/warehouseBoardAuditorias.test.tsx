import { describe, it, expect, vi, afterEach } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

;(global as any).React = React

describe('WarehouseBoard auditorias', () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('pasa almacenId desde params a AuditoriasPanel', async () => {
    vi.doMock('next/navigation', () => ({ useParams: () => ({ id: '7' }) }))
    vi.doMock('../src/components/Toast', () => ({ useToast: () => ({ show: vi.fn(), confirm: vi.fn() }) }))
    vi.doMock('../src/app/dashboard/almacenes/board/BoardProvider', () => ({
      useBoard: () => ({
        materiales: [],
        selectedId: null,
        setSelectedId: vi.fn(),
        unidadSel: null,
        setUnidadSel: vi.fn(),
        setAuditoriaSel: vi.fn(),
        eliminar: vi.fn(),
        crear: vi.fn(),
        actualizar: vi.fn(),
        duplicar: vi.fn(),
        mutate: vi.fn(),
      }),
    }))
    let props: any
    vi.doMock('../src/app/dashboard/almacenes/[id]/AuditoriasPanel', () => ({
      __esModule: true,
      default: (p: any) => {
        props = p
        return null
      },
    }))

    const WarehouseBoard = (await import('../src/app/dashboard/almacenes/components/WarehouseBoard')).default
    renderToStaticMarkup(<WarehouseBoard />)
    expect(props.almacenId).toBe(7)
  })
})
