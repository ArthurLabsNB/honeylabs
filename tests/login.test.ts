import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

process.env.JWT_SECRET = 'test-secret'

const { POST } = await import('../src/app/api/login/route')

afterEach(() => vi.restoreAllMocks())

describe('login', () => {
  it('retorna 401 si el usuario no existe', async () => {
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ correo: 'no@user.com', contrasena: 'pass' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('retorna 403 si la cuenta no está activa', async () => {
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue({
      id: 1,
      nombre: 'Test',
      correo: 'test@user.com',
      contrasena: 'hash',
      tipoCuenta: 'individual',
      estado: 'pendiente',
      entidad: null,
      roles: [],
      suscripciones: [],
    } as any)
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as any)
    const req = new NextRequest('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ correo: 'test@user.com', contrasena: 'pass' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })
})
