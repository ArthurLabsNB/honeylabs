import { describe, it, expect, vi, afterEach } from 'vitest'
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
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ id: 9 })
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
