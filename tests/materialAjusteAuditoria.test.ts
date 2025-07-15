import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('PATCH /api/materiales/[id]/ajuste', () => {
  it('retorna auditoria al ajustar', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const prismaMock = {
      material: { findUnique: vi.fn().mockResolvedValue({ almacenId: 2, nombre: 'm' }), update: vi.fn() },
      usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id:1 }) },
      movimientoMaterial: { create: vi.fn() },
      reporte: { create: vi.fn().mockResolvedValue({}) },
      alerta: { create: vi.fn() },
    }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ id: 9 })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { PATCH } = await import('../src/app/api/materiales/[id]/ajuste/route')
    const req = new NextRequest('http://localhost/api/materiales/5/ajuste', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: 3 }),
    })
    const res = await PATCH(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})
