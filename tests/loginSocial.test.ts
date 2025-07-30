import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'

const { GET } = await import('../src/app/api/login/social/route')

describe('GET /api/login/social', () => {
  it('redirige a NextAuth con provider valido', () => {
    const req = new NextRequest('http://localhost/api/login/social?provider=google')
    const res = GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe(
      'http://localhost/api/auth/callback/google',
    )
  })

  it('retorna 400 si provider invalido', () => {
    const req = new NextRequest('http://localhost/api/login/social?provider=foo')
    const res = GET(req)
    expect(res.status).toBe(400)
  })
})
