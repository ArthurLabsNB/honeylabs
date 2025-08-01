import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('DELETE /api/materiales/[id]', () => {
  it('pasa motivo a registrarAuditoria', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const tx = {
      historialLote: { deleteMany: vi.fn() },
      materialUnidad: { deleteMany: vi.fn() },
      archivoMaterial: { deleteMany: vi.fn() },
      material: { delete: vi.fn() },
    }
    const prismaMock = {
      material: { findUnique: vi.fn().mockResolvedValue({ almacenId: 2 }) },
      usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      $transaction: vi.fn().mockImplementation(async (cb:any)=> cb(tx))
    }
    vi.doMock('@lib/db/prisma', () => ({ prisma: prismaMock }))
    vi.doMock('../src/lib/snapshot', () => ({ snapshotMaterial: vi.fn() }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { DELETE } = await import('../src/app/api/materiales/[id]/route')
    const body = JSON.stringify({ motivo: 'razon' })
    const req = new NextRequest('http://localhost/api/materiales/5', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    expect(registrarAuditoria).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'material',
      5,
      'eliminacion',
      { motivo: 'razon' },
    )
  })
})
