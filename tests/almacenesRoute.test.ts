import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../src/app/api/almacenes/route'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'
import * as db from '../lib/db'

function createQuery(result: any) {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: result, error: null }),
    then: (resolve: any) => Promise.resolve({ data: result, error: null }).then(resolve),
  }
  return builder
}

afterEach(() => vi.restoreAllMocks())

describe('GET /api/almacenes', () => {
  it('requiere sesion', async () => {
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from: vi.fn() } } as any)
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const res = await GET(new NextRequest('http://localhost/api/almacenes'))
    expect(res.status).toBe(401)
  })

  it('rechaza si no es el mismo usuario y no es admin', async () => {
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from: vi.fn() } } as any)
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(false)
    const req = new NextRequest('http://localhost/api/almacenes?usuarioId=2')
    const res = await GET(req)
    expect(res.status).toBe(403)
  })

  it('filtra por usuario', async () => {
    const eq = vi.fn().mockReturnThis()
    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq,
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: (resolve: any) => Promise.resolve({ data: [] as any[], error: null }).then(resolve),
    }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 3 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const req = new NextRequest('http://localhost/api/almacenes?usuarioId=5')
    await GET(req)
    expect(eq).toHaveBeenCalledWith('usuario_id', 5)
  })

  it('incluye total de unidades', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)

    const queries = [
      { result: [{ almacen_id: 2 }] },
      {
        result: [
          {
            id: 2,
            nombre: 'A',
            descripcion: '',
            imagenNombre: null,
            imagenUrl: null,
            fechaCreacion: new Date(),
            codigoUnico: 'c',
            encargado_nombre: null,
            encargado_correo: null,
            ultima_actualizacion: null,
            notificaciones: 0,
            entradas: 0,
            salidas: 0,
            inventario: 0,
            unidades: 7,
          },
        ],
      },
      { result: { preferencias: null }, single: true },
    ]

    const from = vi.fn(() => {
      const q = queries.shift()!
      const builder = createQuery(q.result)
      if (q.single) {
        builder.single = vi.fn().mockResolvedValue({ data: q.result, error: null })
      }
      return builder
    })

    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)

    const res = await GET(new NextRequest('http://localhost/api/almacenes'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.almacenes[0].unidades).toBe(7)
  })

  it('propaga errores de supabase', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)

    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: (resolve: any) =>
        Promise.resolve({ data: null, error: { message: 'fallo supabase' } }).then(resolve),
    }))

    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)

    const res = await GET(new NextRequest('http://localhost/api/almacenes'))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('fallo supabase')
  })
})
