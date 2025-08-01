import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('DELETE /api/auditorias/[id]', () => {
  it('elimina registros y devuelve ok', async () => {
    const prismaMock = {
      archivoAuditoria: { deleteMany: vi.fn().mockResolvedValue(undefined) },
      auditoria: { delete: vi.fn().mockResolvedValue(undefined) },
    }
    vi.doMock('@lib/db/prisma', () => ({ prisma: prismaMock }))
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    const { DELETE } = await import('../src/app/api/auditorias/[id]/route')
    const req = new NextRequest('http://localhost/api/auditorias/4', { method: 'DELETE' })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(prismaMock.archivoAuditoria.deleteMany).toHaveBeenCalledWith({ where: { auditoriaId: 4 } })
    expect(prismaMock.auditoria.delete).toHaveBeenCalledWith({ where: { id: 4 } })
  })
})
