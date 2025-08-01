import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('POST /api/auditorias/[id]/restore', () => {
  it('restaura y registra auditoria', async () => {
    const auditoria = { id: 5, tipo: 'material', observaciones: '{"nombre":"m"}' }
    const prismaMock = {
      auditoria: { findUnique: vi.fn().mockResolvedValue(auditoria) },
      material: { create: vi.fn().mockResolvedValue({ id: 8 }) },
    }
    vi.doMock('@lib/db/prisma', () => ({ prisma: prismaMock }))
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))

    const { POST } = await import('../src/app/api/auditorias/[id]/restore/route')
    const req = new NextRequest('http://localhost/api/auditorias/5/restore', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(prismaMock.material.create).toHaveBeenCalled()
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})
