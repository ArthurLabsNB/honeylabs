import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('GET /api/auditorias/[id]/export', () => {
  it('exporta csv en zip con archivos', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    const auditoria = {
      id: 1,
      tipo: 'material',
      materialId: 5,
      version: 1,
      categoria: 'eliminacion',
      fecha: new Date(),
      observaciones: '{"x":1}',
      usuario: { nombre: 'User' },
      almacen: null,
      material: { nombre: 'mat' },
      unidad: null,
      archivos: [{ nombre: 'f.txt', archivoNombre: 'f.txt', archivo: Buffer.from('data') }],
    }
    const prismaMock = {
      auditoria: { findUnique: vi.fn().mockResolvedValue(auditoria) },
      historialLote: { findFirst: vi.fn().mockResolvedValue({ estado: { snap: true } }) },
    }
    vi.doMock('@lib/db/prisma', () => ({ prisma: prismaMock }))
    const { GET } = await import('../src/app/api/auditorias/[id]/export/route')
    const req = new NextRequest('http://localhost/api/auditorias/1/export?format=csv&files=1')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/zip')
  })
})

