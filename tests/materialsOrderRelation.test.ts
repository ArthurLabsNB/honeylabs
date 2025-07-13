import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET as GET_MATERIALES } from '../src/app/api/materiales/route'
import { POST as POST_MATERIAL } from '../src/app/api/almacenes/[id]/materiales/route'
import { NextRequest } from 'next/server'
import prisma from '../lib/prisma'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => vi.restoreAllMocks())

describe('materiales orden y asociacion', () => {
  it('GET ordena por id desc', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const find = vi.spyOn(prisma.material, 'findMany').mockResolvedValue([] as any)
    const req = new NextRequest('http://localhost/api/materiales')
    await GET_MATERIALES(req)
    expect(find).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { id: 'desc' } }))
  })

  it('POST crea asociacion usuarioAlmacen', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 5 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue({ id: 1 } as any)

    const createMaterial = vi.fn().mockResolvedValue({ id: 10 })
    const upsertRel = vi.fn().mockResolvedValue({})
    const findUnique = vi.fn().mockResolvedValue(null)
    const createHist = vi.fn().mockResolvedValue({})

    vi.spyOn(prisma, '$transaction').mockImplementation(async (cb: any) => {
      return cb({
        material: { create: createMaterial, findUnique: findUnique },
        usuarioAlmacen: { upsert: upsertRel },
        historialLote: { create: createHist },
      })
    })

    const form = new FormData()
    form.set('nombre', 'nuevo123')
    form.set('cantidad', '1')
    const req = new NextRequest('http://localhost/api/almacenes/2/materiales', {
      method: 'POST',
      body: form,
    })

    await POST_MATERIAL(req)
    expect(upsertRel).toHaveBeenCalled()
  })
})
