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
    let lock: Promise<any> = Promise.resolve()
    const match = vi.fn(async () => ({ count, error: null }))
    const select = vi.fn(() => ({ match }))
    const insertSelectSingle = vi.fn(async () => ({ data: { id: count }, error: null }))
    const insert = vi.fn((data: any) => {
      count += 1
      versions.push(data.version)
      return { select: () => ({ single: insertSelectSingle }) }
    })
    const from = vi.fn(() => ({ select, insert }))
    const transaction = vi.fn(async (cb: any) => {
      const run = lock.then(() => cb({ from }))
      lock = run.catch(() => {})
      return run
    })
    vi.doMock('@lib/db', () => ({ getDb: () => ({ client: { from }, transaction }) }))
    vi.doMock('../lib/auth', () => ({
      getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }),
    }))
    vi.doMock('../lib/auditoriaInit', () => ({ ensureAuditoriaTables: vi.fn() }))

    const { POST } = await import('../src/app/api/auditorias/route')
    const body = JSON.stringify({
      tipo: 'almacen',
      objetoId: '1',
      categoria: 'creacion',
      observaciones: 'ok',
    })
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
