import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('POST /api/auditorias', () => {
  it('crea auditoria con datos válidos', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/auditoriaInit', () => ({ ensureAuditoriaTables: vi.fn() }))

    const match = vi.fn().mockResolvedValue({ count: 0, error: null })
    const selectCount = vi.fn(() => ({ match }))
    const insertSingle = vi.fn().mockResolvedValue({ data: { id: 3 }, error: null })
    const insertSelect = vi.fn(() => ({ single: insertSingle }))
    const insert = vi.fn(() => ({ select: insertSelect }))
    const from = vi.fn((table: string) => ({ select: selectCount, insert }))
    const transaction = vi.fn(async (cb: any) => cb({ from }))

    vi.doMock('@lib/db', () => ({ getDb: () => ({ client: { from }, transaction }) }))

    const { POST } = await import('../src/app/api/auditorias/route')
    const body = JSON.stringify({ tipo: 'almacen', objetoId: 2, categoria: 'creacion', observaciones: '{}' })
    const req = new NextRequest('http://localhost/api/auditorias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 3 })
    expect(insert).toHaveBeenCalled()
  })

  it('retorna 400 cuando datos inválidos', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/auditoriaInit', () => ({ ensureAuditoriaTables: vi.fn() }))
    vi.doMock('@lib/db', () => ({ getDb: () => ({ client: { from: vi.fn() }, transaction: vi.fn() }) }))
    const { POST } = await import('../src/app/api/auditorias/route')
    const req = new NextRequest('http://localhost/api/auditorias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retorna 400 con form-data inválido', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/auditoriaInit', () => ({ ensureAuditoriaTables: vi.fn() }))
    vi.doMock('@lib/db', () => ({ getDb: () => ({ client: { from: vi.fn() }, transaction: vi.fn() }) }))
    const { POST } = await import('../src/app/api/auditorias/route')
    const form = new FormData()
    form.set('tipo', 'almacen')
    const req = new NextRequest('http://localhost/api/auditorias', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
