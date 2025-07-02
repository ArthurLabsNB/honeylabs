import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import { POST } from '../src/app/api/build-mobile/route'

afterEach(() => vi.restoreAllMocks())

describe('build mobile endpoint', () => {
  it('rejects unauthorized user', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/build-mobile', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('triggers build for admin', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    const req = new NextRequest('http://localhost/api/build-mobile', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })
})
