import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import prisma from '../lib/prisma'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

const { GET, DELETE } = await import('../src/app/api/almacenes/[id]/usuarios/route')

afterEach(() => vi.restoreAllMocks())

describe('GET /api/almacenes/[id]/usuarios', () => {
  it('requiere sesion', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/almacenes/1/usuarios')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('lista usuarios', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue({ id: 9 } as any)
    const find = vi.spyOn(prisma.usuarioAlmacen, 'findMany').mockResolvedValue([
      { usuario: { correo: 'a@x.com', nombre: 'A' }, rolEnAlmacen: 'visualizacion' },
    ] as any)
    const req = new NextRequest('http://localhost/api/almacenes/1/usuarios')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(find).toHaveBeenCalled()
  })
})

describe('DELETE /api/almacenes/[id]/usuarios', () => {
  it('revoca acceso', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue({ id: 9 } as any)
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue({ id: 2 } as any)
    const del = vi.spyOn(prisma.usuarioAlmacen, 'delete').mockResolvedValue({} as any)
    const req = new NextRequest('http://localhost/api/almacenes/1/usuarios?correo=a%40x.com', { method: 'DELETE' })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    expect(del).toHaveBeenCalled()
  })
})
