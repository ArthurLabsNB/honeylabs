import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

vi.mock('@lib/db', () => ({ getDb: vi.fn() }))

process.env.JWT_SECRET = 'test-secret'

const { getDb } = await import('@lib/db')
const { POST } = await import('../src/app/api/login/route')

afterEach(() => vi.restoreAllMocks())

describe('login', () => {
  it('retorna 401 si el usuario no existe', async () => {
    const from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })
    vi.mocked(getDb).mockReturnValue({ client: { from } } as any)
    const req = new NextRequest('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ correo: 'no@user.com', contrasena: 'pass' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('retorna 403 si la cuenta no está activa', async () => {
    const from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: 1,
          nombre: 'Test',
          correo: 'test@user.com',
          contrasena: 'hash',
          tipo_cuenta: 'individual',
          estado: 'pendiente',
          entidad: null,
          roles: [],
        },
        error: null,
      }),
    })
    vi.mocked(getDb).mockReturnValue({ client: { from } } as any)
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as any)
    const req = new NextRequest('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ correo: 'test@user.com', contrasena: 'pass' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('retorna 400 si los campos no son válidos', async () => {
    const req = new NextRequest('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ correo: '', contrasena: '' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
