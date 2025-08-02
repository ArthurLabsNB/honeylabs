import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('DELETE /api/auditorias/[id]', () => {
  it('elimina registros y devuelve ok', async () => {
    const archivoEq = vi.fn().mockResolvedValue({ error: null })
    const auditoriaEq = vi.fn().mockResolvedValue({ error: null })
    const from = vi.fn((table: string) => {
      if (table === 'ArchivoAuditoria') return { delete: () => ({ eq: archivoEq }) }
      if (table === 'Auditoria') return { delete: () => ({ eq: auditoriaEq }) }

    })
    vi.doMock('@lib/db', () => ({ getDb: () => ({ client: { from } }) }))
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    const { DELETE } = await import('../src/app/api/auditorias/[id]/route')
    const req = new NextRequest('http://localhost/api/auditorias/4', { method: 'DELETE' })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(archivoEq).toHaveBeenCalledWith('auditoriaId', 4)
    expect(auditoriaEq).toHaveBeenCalledWith('id', 4)

  })
})
