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
    const prismaMock = {
      auditoria: { create: vi.fn().mockResolvedValue({ id: 3 }), count: vi.fn().mockResolvedValue(0) },
      archivoAuditoria: { create: vi.fn() },
      $transaction: vi.fn(async (cb: any) => cb(prismaMock)),
    }
    vi.doMock('@lib/db/prisma', () => ({ prisma: prismaMock }))

    const { POST } = await import('../src/app/api/auditorias/route')
    const body = JSON.stringify({ tipo: 'almacen', objetoId: 2, categoria: 'creacion', observaciones: '{}' })
    const req = new NextRequest('http://localhost/api/auditorias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 3 })
    expect(prismaMock.auditoria.create).toHaveBeenCalled()
  })

  it('retorna 400 cuando datos inválidos', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/auditoriaInit', () => ({ ensureAuditoriaTables: vi.fn() }))
    vi.doMock('@lib/db/prisma', () => ({ prisma: {} }))
    const { POST } = await import('../src/app/api/auditorias/route')
    const req = new NextRequest('http://localhost/api/auditorias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retorna 400 con form-data inválido', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/auditoriaInit', () => ({ ensureAuditoriaTables: vi.fn() }))
    vi.doMock('@lib/db/prisma', () => ({ prisma: {} }))
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
