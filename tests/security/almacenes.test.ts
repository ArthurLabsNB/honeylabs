import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET, PUT, DELETE } from '../../src/app/api/almacenes/[id]/route'
import { NextRequest } from 'next/server'
import prisma from '../../lib/prisma'
import * as auth from '../../lib/auth'
import * as permisos from '../../lib/permisos'

afterEach(() => vi.restoreAllMocks())

describe('seguridad de almacenes', () => {
  it('GET requiere sesion', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const res = await GET(new NextRequest('http://localhost'), { params: { id: '1' } })
    expect(res.status).toBe(401)
  })

  it('GET rechaza si no pertenece', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue(null as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(false)
    const res = await GET(new NextRequest('http://localhost'), { params: { id: '1' } })
    expect(res.status).toBe(403)
  })

  it('PUT rechaza si no pertenece', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue(null as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(false)
    const req = new NextRequest('http://localhost', { method: 'PUT', body: '{}' })
    const res = await PUT(req, { params: { id: '1' } })
    expect(res.status).toBe(403)
  })

  it('DELETE rechaza si no pertenece', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue(null as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(false)
    const res = await DELETE(new NextRequest('http://localhost', { method: 'DELETE' }), { params: { id: '1' } })
    expect(res.status).toBe(403)
  })
})
