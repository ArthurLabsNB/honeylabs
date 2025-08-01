import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import React from 'react'
(global as any).React = React
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('PUT /api/materiales/[id]', () => {
  it('retorna auditoria al actualizar', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const update = vi.fn().mockResolvedValue({ id: 5 })
    const hist = vi.fn().mockResolvedValue({})
    const prismaMock = {
      material: { findUnique: vi.fn().mockResolvedValue({
        almacenId: 2,
        miniatura: null,
        archivos: [],
      }), update },
      usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      historialLote: { create: hist },
      $transaction: vi.fn().mockImplementation(async (cb: any) => cb(prismaMock)),
    }
    vi.doMock('@lib/db/prisma', () => ({ prisma: prismaMock }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { PUT } = await import('../src/app/api/materiales/[id]/route')
    const body = JSON.stringify({ nombre: 'nuevo' })
    const req = new NextRequest('http://localhost/api/materiales/5', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    const res = await PUT(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})

describe('MaterialFormTab y UnidadFormTab', () => {
  let toast: { show: ReturnType<typeof vi.fn> }
  let close: ReturnType<typeof vi.fn>
  let mutate: ReturnType<typeof vi.fn>
  let setSelectedId: ReturnType<typeof vi.fn>
  let setUnidadSel: ReturnType<typeof vi.fn>
  let baseMat: any
  let unidad: any

  beforeEach(() => {
    toast = { show: vi.fn() }
    close = vi.fn()
    mutate = vi.fn()
    setSelectedId = vi.fn()
    setUnidadSel = vi.fn()
    baseMat = { id: 'm1', dbId: 1, nombre: 'mat', archivos: [] }
    unidad = { id: 1, nombre: 'u1' }
    vi.doMock('../src/components/Toast', () => ({ useToast: () => toast }))
    vi.doMock('../src/hooks/useTabs', () => ({ useTabStore: () => ({ close }) }))
    vi.doMock('../src/app/dashboard/almacenes/components/MaterialForm', () => ({
      __esModule: true,
      default: (p: any) => {
        ;(global as any).matGuardar = p.onGuardar
        return null
      },
    }))
    vi.doMock('../src/app/dashboard/almacenes/components/UnidadForm', () => ({
      __esModule: true,
      default: (p: any) => {
        ;(global as any).uniGuardar = p.onGuardar
        return null
      },
    }))
    vi.doMock('../src/app/dashboard/almacenes/board/BoardProvider', () => ({
      useBoard: () => ({
        selectedId: 'm1',
        materiales: [baseMat],
        setSelectedId,
        unidadSel: unidad,
        setUnidadSel,
        eliminar: vi.fn(),
        mutate,
        crear: vi.fn().mockResolvedValue({ material: baseMat }),
        actualizar: vi.fn().mockResolvedValue({ material: baseMat }),
      }),
    }))
    vi.doMock('@/hooks/useUnidades', () => ({
      __esModule: true,
      default: () => ({
        actualizar: vi.fn().mockResolvedValue({ unidad }),
        mutate,
      }),
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    delete (global as any).matGuardar
    delete (global as any).uniGuardar
    toast = { show: vi.fn() }
    close = vi.fn()
    mutate = vi.fn()
    setSelectedId = vi.fn()
    setUnidadSel = vi.fn()
  })

  it('muestra toast de exito y actualiza listas', async () => {
    const { renderToStaticMarkup } = await import('react-dom/server')
    const React = await import('react')
    const MaterialFormTab = (
      await import('../src/app/dashboard/almacenes/components/tabs/MaterialFormTab')
    ).default
    renderToStaticMarkup(<MaterialFormTab tabId="t1" />)
    await (global as any).matGuardar()
    expect(toast.show).toHaveBeenCalledWith('Material guardado', 'success')
    expect(mutate).toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()
  })

  it('muestra error sin cerrar', async () => {
    vi.doMock('../src/app/dashboard/almacenes/board/BoardProvider', () => ({
      useBoard: () => ({
        selectedId: 'm1',
        materiales: [baseMat],
        setSelectedId,
        unidadSel: unidad,
        setUnidadSel,
        eliminar: vi.fn(),
        mutate,
        crear: vi.fn(),
        actualizar: vi.fn().mockResolvedValue({ error: 'fail' }),
      }),
    }))
    const { renderToStaticMarkup } = await import('react-dom/server')
    const MaterialFormTab = (
      await import('../src/app/dashboard/almacenes/components/tabs/MaterialFormTab')
    ).default
    renderToStaticMarkup(<MaterialFormTab tabId="t2" />)
    await (global as any).matGuardar()
    expect(toast.show).toHaveBeenCalledWith('fail', 'error')
    expect(mutate).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()
  })

  it('guarda unidad y actualiza listas', async () => {
    const { renderToStaticMarkup } = await import('react-dom/server')
    const UnidadFormTab = (
      await import('../src/app/dashboard/almacenes/components/tabs/UnidadFormTab')
    ).default
    renderToStaticMarkup(<UnidadFormTab tabId="t3" />)
    await (global as any).uniGuardar()
    expect(toast.show).toHaveBeenCalledWith('Unidad guardada', 'success')
    expect(mutate).toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()
  })
})
