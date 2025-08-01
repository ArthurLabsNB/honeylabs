import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as db from '../lib/db'
import * as auth from '../lib/auth'

const { GET, POST } = await import('../src/app/api/notas/route')
const { PUT } = await import('../src/app/api/notas/[id]/route')

afterEach(() => vi.restoreAllMocks())

describe('api notas', () => {
  it('requiere sesion', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/notas?tabId=t1')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('crea nota', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    const single = vi.fn().mockResolvedValue({ data: { id: 2 }, error: null })
    const select = vi.fn(() => ({ single }))
    const insert = vi.fn(() => ({ select }))
    const from = vi.fn(() => ({ insert }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    const body = JSON.stringify({ tabId: 't1', tipo: 'url', contenido: 'http://x' })
    const req = new NextRequest('http://localhost/api/notas', { method: 'POST', body })
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(insert).toHaveBeenCalledWith({ tabId: 't1', tipo: 'url', contenido: 'http://x' })
  })

  it('actualiza nota', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    const single = vi.fn().mockResolvedValue({ data: { id: 2 }, error: null })
    const select = vi.fn(() => ({ single }))
    const eq = vi.fn(() => ({ select }))
    const update = vi.fn(() => ({ eq }))
    const from = vi.fn(() => ({ update }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    const req = new NextRequest('http://localhost/api/notas/2', { method: 'PUT', body: JSON.stringify({ contenido: 'c2' }) })
    const res = await PUT(req)
    expect(res.status).toBe(200)
    expect(update).toHaveBeenCalled()
  })
})
