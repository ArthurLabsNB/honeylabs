import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('POST /api/almacenes/[id]/duplicar', () => {
  it('retorna auditoria al duplicar', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const almacen = {
      nombre: 'A',
      descripcion: '',
      funciones: '',
      permisosPredeterminados: '',
      imagenUrl: null,
      imagenNombre: null,
      imagen: null,
      entidadId: 2,
    }
    const prismaMock = {
      almacen: {
        findUnique: vi.fn().mockResolvedValue(almacen),
        create: vi.fn().mockResolvedValue({ id: 6, nombre: 'A copia' }),
      },
    }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { POST } = await import('../src/app/api/almacenes/[id]/duplicar/route')
    const req = new NextRequest('http://localhost/api/almacenes/5/duplicar', {
      method: 'POST',
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})
