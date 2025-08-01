import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@lib/db/prisma'
import { SESSION_COOKIE } from '@lib/constants'

process.env.JWT_SECRET = 'test-secret'
process.env.DB_PROVIDER = 'prisma'

const { POST } = await import('../src/app/api/login/route')

afterEach(() => vi.restoreAllMocks())

describe('login success', () => {
  it('retorna 200 y cookie de sesion si credenciales validas', async () => {
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue({
      id: 1,
      nombre: 'Test',
      correo: 'test@user.com',
      contrasena: 'hash',
      tipoCuenta: 'individual',
      estado: 'activo',
      entidad: null,
      roles: [],
      suscripciones: [],
    } as any)
    const originalSesion = (prisma as any).sesionUsuario
    ;(prisma as any).sesionUsuario = { create: vi.fn().mockResolvedValue({ id: 10 }) }
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as any)

    const req = new NextRequest('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ correo: 'test@user.com', contrasena: 'pass' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(res.cookies.get(SESSION_COOKIE)?.value).toBeTruthy()
    ;(prisma as any).sesionUsuario = originalSesion
  })
})
