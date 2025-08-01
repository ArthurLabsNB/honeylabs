import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/db/prisma'
import * as auth from '../lib/auth'

const { GET, POST } = await import('../src/app/api/notas/route')
const { PUT, DELETE } = await import('../src/app/api/notas/[id]/route')

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
    const create = vi.spyOn((prisma as any).nota, 'create').mockResolvedValue({ id: 2 })
    const body = JSON.stringify({ tabId: 't1', tipo: 'url', contenido: 'http://x' })
    const req = new NextRequest('http://localhost/api/notas', { method: 'POST', body })
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(create).toHaveBeenCalledWith({ data: { tabId: 't1', tipo: 'url', contenido: 'http://x' } })
  })

  it('actualiza nota', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    const update = vi.spyOn((prisma as any).nota, 'update').mockResolvedValue({ id: 2 })
    const req = new NextRequest('http://localhost/api/notas/2', { method: 'PUT', body: JSON.stringify({ contenido: 'c2' }) })
    const res = await PUT(req)
    expect(res.status).toBe(200)
    expect(update).toHaveBeenCalled()
  })
})
