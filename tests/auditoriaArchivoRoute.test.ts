import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('GET /api/auditorias/[id]/archivos/[archivoId]', () => {
  it('devuelve 200 con archivo', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/prisma', () => ({
      default: { archivoAuditoria: { findUnique: vi.fn().mockResolvedValue({ archivo: Buffer.from('data'), archivoNombre: 'a.txt' }) } }
    }))
    const { GET } = await import('../src/app/api/auditorias/[id]/archivos/[archivoId]/route')
    const req = new NextRequest('http://localhost/api/auditorias/1/archivos/2')
    const res = await GET(req)
    expect(res.status).toBe(200)
  })
})
