import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('DELETE /api/materiales/[id]/unidades/[unidadId]', () => {
  it('pasa motivo a registrarAuditoria', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const prismaMock = {
      material: { findUnique: vi.fn().mockResolvedValue({ almacenId: 2 }) },
      usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      materialUnidad: { delete: vi.fn() },
    }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    vi.doMock('../src/lib/snapshot', () => ({ snapshotUnidad: vi.fn() }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { DELETE } = await import('../src/app/api/materiales/[id]/unidades/[unidadId]/route')
    const body = JSON.stringify({ motivo: 'mot' })
    const req = new NextRequest('http://localhost/api/materiales/5/unidades/3', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    expect(registrarAuditoria).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'unidad',
      3,
      'eliminacion',
      { motivo: 'mot' },
    )
  })
})
