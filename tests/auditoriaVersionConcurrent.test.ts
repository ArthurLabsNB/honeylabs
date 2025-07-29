import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('POST /api/auditorias concurrencia', () => {
  it('asigna versiones consecutivas', async () => {
    let count = 0
    const versions: number[] = []
    const prismaMock = {
      auditoria: {
        count: vi.fn(async () => count),
        create: vi.fn(async ({ data }: any) => {
          count += 1
          versions.push(data.version)
          return { id: count }
        }),
      },
      archivoAuditoria: { create: vi.fn() },
      $transaction: vi.fn(async (cb: any) => cb(prismaMock)),
    }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    vi.doMock('../lib/auth', () => ({
      getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }),
    }))
    vi.doMock('../lib/auditoriaInit', () => ({ ensureAuditoriaTables: vi.fn() }))

    const { POST } = await import('../src/app/api/auditorias/route')
    const body = JSON.stringify({ tipo: 'almacen', objetoId: '1' })
    const req = new NextRequest('http://localhost/api/auditorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    const responses = await Promise.all([
      POST(req.clone()),
      POST(req.clone()),
      POST(req.clone()),
    ])

    for (const r of responses) expect(r.status).toBe(200)
    expect(versions).toEqual([1, 2, 3])
  })
})
