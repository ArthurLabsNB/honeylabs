import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

import * as db from '../lib/db'
import * as auth from '../lib/auth'

const { GET, POST } = await import('../src/app/api/reportes/route')

afterEach(() => vi.restoreAllMocks())

describe('api reportes', () => {
  it('requiere sesion en GET', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/reportes')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('lista reportes', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'empresarial' } as any)
    const limit = vi.fn().mockResolvedValue({ data: [], error: null })
    const order = vi.fn(() => ({ limit }))
    const select = vi.fn(() => ({ order, limit }))
    const from = vi.fn(() => ({ select }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    const req = new NextRequest('http://localhost/api/reportes')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(from).toHaveBeenCalledWith('reporte')
  })

  it('crea reporte', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1, tipoCuenta: 'empresarial' } as any)
    const single = vi.fn().mockResolvedValue({ data: { id: 2 }, error: null })
    const select = vi.fn(() => ({ single }))
    const insert = vi.fn(() => ({ select }))
    const from = vi.fn(() => ({ insert }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    const body = JSON.stringify({ tipo: 'almacen', objetoId: 3, categoria: 'test', observaciones: '{}' })
    const req = new NextRequest('http://localhost/api/reportes', { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(insert).toHaveBeenCalled()
  })
})

