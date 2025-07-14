import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../src/app/api/almacenes/route'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'
import prisma from '../lib/prisma'

afterEach(() => vi.restoreAllMocks())

describe('GET /api/almacenes', () => {
  it('requiere sesion', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const res = await GET(new NextRequest('http://localhost/api/almacenes'))
    expect(res.status).toBe(401)
  })

  it('rechaza si no es el mismo usuario y no es admin', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(false)
    const req = new NextRequest('http://localhost/api/almacenes?usuarioId=2')
    const res = await GET(req)
    expect(res.status).toBe(403)
  })

  it('filtra por usuario', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 3 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const find = vi.spyOn(prisma.almacen, 'findMany').mockResolvedValue([] as any)
    const req = new NextRequest('http://localhost/api/almacenes?usuarioId=5')
    await GET(req)
    expect(find).toHaveBeenCalledWith(expect.objectContaining({ where: { usuarios: { some: { usuarioId: 5 } } } }))
  })
})
