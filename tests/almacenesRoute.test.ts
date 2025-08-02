import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../src/app/api/almacenes/route'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'
import { prisma } from '@lib/db/prisma'
import * as db from '../lib/db'

afterEach(() => vi.restoreAllMocks())

describe('GET /api/almacenes', () => {
  const from = vi.fn()
  vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
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
    expect(find).toHaveBeenCalledWith(expect.objectContaining({ where: { usuario_almacen: { some: { usuarioId: 5 } } } }))
  })

  it('incluye total de unidades', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)

    const almacenesData = [
      {
        id: 2,
        nombre: 'A',
        descripcion: '',
        imagenNombre: null,
        imagenUrl: null,
        fechaCreacion: new Date(),
        codigoUnico: 'c',
        usuario_almacen: [],
        movimientos: [],
        notificaciones: [],
      },
    ] as any

    vi.spyOn(prisma.almacen, 'findMany').mockResolvedValue(almacenesData)
    ;(prisma as any).movimiento = { groupBy: vi.fn().mockResolvedValue([]) }
    ;(prisma.material as any).groupBy = vi.fn().mockResolvedValue([])
    ;(prisma.material as any).findMany = vi
      .spyOn(prisma.material, 'findMany')
      .mockResolvedValue([{ almacenId: 2, _count: { unidades: 7 } }] as any)
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(null as any)

    const res = await GET(new NextRequest('http://localhost/api/almacenes'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.almacenes[0].unidades).toBe(7)
  })
})
