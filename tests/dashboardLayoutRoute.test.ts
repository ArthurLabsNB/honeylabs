import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'

afterEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
})

describe('dashboard layout api', () => {
  it('returns stored layout', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({
      preferencias: JSON.stringify({ dashboardLayout: { b1: [{ id: 'a' }] } })
    } as any)
    const { GET } = await import('../src/app/api/dashboard/layout/route')
    const res = await GET()
    const data = await res.json()
    expect(data.b1[0].id).toBe('a')
  })

  it('merges board tabs on POST', async () => {
    const user = {
      id: 1,
      preferencias: JSON.stringify({ dashboardLayout: { b1: [{ id: 'a' }] } })
    }

    const eq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn().mockReturnValue({ eq })
    const from = vi.fn().mockReturnValue({ update })

    vi.doMock('../lib/auth', () => ({
      getUsuarioFromSession: vi.fn().mockResolvedValue(user)
    }))
    vi.doMock('@lib/db', () => ({ getDb: () => ({ client: { from } }) }))

    const { POST } = await import('../src/app/api/dashboard/layout/route')
    const body = JSON.stringify({ b2: [{ id: 'b' }] })
    const req = new NextRequest('http://localhost/api/dashboard/layout', { method: 'POST', body })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(from).toHaveBeenCalledWith('usuario')
    expect(update).toHaveBeenCalledWith({
      preferencias: JSON.stringify({
        dashboardLayout: { b1: [{ id: 'a' }], b2: [{ id: 'b' }] }
      })
    })
    expect(eq).toHaveBeenCalledWith('id', user.id)
  })
})

