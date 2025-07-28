import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('POST /api/almacenes/[id]/movimientos', () => {
  it('retorna auditoria al registrar movimiento', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/permisos', () => ({
      hasManagePerms: vi.fn().mockReturnValue(true),
      hasPermission: vi.fn().mockReturnValue(true),
    }))
    const create = vi.fn()
    const tx = { movimiento: { create } }
    const prismaMock = {
      usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      $transaction: vi.fn().mockImplementation(async (cb: any) => cb(tx)),
    }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { POST } = await import('../src/app/api/almacenes/[id]/movimientos/route')
    const req = new NextRequest('http://localhost/api/almacenes/5/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'entrada', cantidad: 2 }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})
