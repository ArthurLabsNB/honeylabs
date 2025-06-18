import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import prisma from '../lib/prisma'
import * as auth from '../lib/auth'

const { PUT } = await import('../src/app/api/admin/usuarios/[id]/route')

afterEach(() => vi.restoreAllMocks())

describe('admin actualizar usuario', () => {
  it('requiere autenticacion', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/admin/usuarios/1', { method: 'PUT', body: '{}' })
    const res = await PUT(req)
    expect(res.status).toBe(401)
  })

  it('requiere permisos de admin', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'individual' } as any)
    const req = new NextRequest('http://localhost/api/admin/usuarios/1', { method: 'PUT', body: '{}' })
    const res = await PUT(req)
    expect(res.status).toBe(403)
  })

  it('actualiza datos', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    const update = vi.spyOn(prisma.usuario, 'update').mockResolvedValue({} as any)
    const req = new NextRequest('http://localhost/api/admin/usuarios/1', {
      method: 'PUT',
      body: JSON.stringify({ correo: 'nuevo@x.com' }),
    })
    const res = await PUT(req)
    expect(res.status).toBe(200)
    expect(update).toHaveBeenCalled()
  })
})

