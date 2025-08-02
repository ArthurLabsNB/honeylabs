import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { GET as GET_MATERIALES } from '../src/app/api/materiales/route'
import { POST as POST_MATERIAL } from '../src/app/api/almacenes/[id]/materiales/route'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/db/prisma'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'
import * as reporter from '../lib/reporter'
import * as db from '../lib/db'
import * as snapshot from '../src/lib/snapshot'
import * as audit from '../src/lib/audit'

afterEach(() => vi.restoreAllMocks())

beforeEach(() => {
  vi.spyOn(reporter, 'registrarAuditoria').mockResolvedValue({})
})

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
    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    }))
    const upsertRel = vi.fn().mockResolvedValue({ data: {}, error: null })
    const txFrom = (table: string) => {
      if (table === 'material') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 10, nombre: '', miniaturaNombre: null }, error: null }),
            }),
          }),
        }
      }
      if (table === 'usuario_almacen') {
        return { upsert: upsertRel }
      }
      return {}
    }
    vi.spyOn(db, 'getDb').mockReturnValue({
      client: { from },
      transaction: (cb: any) => cb({ from: txFrom }),
    } as any)
    vi.spyOn(snapshot, 'snapshotMaterial').mockResolvedValue(undefined as any)
    vi.spyOn(audit, 'logAudit').mockResolvedValue(undefined as any)

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
