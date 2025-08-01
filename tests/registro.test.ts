import { describe, it, expect, vi, afterEach } from 'vitest'
import { POST } from '../src/app/api/registro/route'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/db/prisma'

afterEach(() => vi.restoreAllMocks())

describe('registro', () => {
  it('requiere archivo para cuentas empresariales', async () => {
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(null as any)
    const form = new FormData()
    form.set('nombre', 'Test')
    form.set('apellidos', 'User')
    form.set('correo', 'nuevo@ejemplo.com')
    form.set('contrasena', '123456')
    form.set('tipoCuenta', 'empresarial')
    const req = new NextRequest('http://localhost/api/registro', { method: 'POST', body: form })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rechaza correo repetido', async () => {
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue({ id: 1 } as any)
    const form = new FormData()
    form.set('nombre', 'Test')
    form.set('apellidos', 'User')
    form.set('correo', 'existente@ejemplo.com')
    form.set('contrasena', '123456')
    form.set('tipoCuenta', 'individual')
    const req = new NextRequest('http://localhost/api/registro', { method: 'POST', body: form })
    const res = await POST(req)
    expect(res.status).toBe(409)
  })

  it('rechaza contrasena corta', async () => {
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(null as any)
    const form = new FormData()
    form.set('nombre', 'Test')
    form.set('apellidos', 'User')
    form.set('correo', 'nuevo2@ejemplo.com')
    form.set('contrasena', '123')
    form.set('tipoCuenta', 'individual')
    const req = new NextRequest('http://localhost/api/registro', { method: 'POST', body: form })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
