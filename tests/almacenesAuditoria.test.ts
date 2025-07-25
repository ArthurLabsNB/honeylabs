import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('POST /api/almacenes', () => {
  it('retorna auditoria al crear', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1, entidadId: 2, tipoCuenta: 'admin', nombre: 'u' }) }))
    vi.doMock('../lib/permisos', () => ({ hasManagePerms: vi.fn().mockReturnValue(true) }))
    const create = vi.fn().mockResolvedValue({ id: 5, nombre: 'A', descripcion: '', imagenNombre: null, imagenUrl: null, codigoUnico: 'c' })
    const findUnique = vi.fn().mockResolvedValue(null)
    const hist = vi.fn().mockResolvedValue({})
    const tx = { almacen: { create, findUnique }, historialAlmacen: { create: hist } }
    const prismaMock = { $transaction: vi.fn().mockImplementation(async (cb:any)=> cb(tx)) }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { POST } = await import('../src/app/api/almacenes/route')
    const body = JSON.stringify({ nombre: 'A', descripcion: '', funciones: '', permisosPredeterminados: '' })
    const req = new NextRequest('http://localhost/api/almacenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})

describe('PUT /api/almacenes/[id]', () => {
  it('retorna auditoria al actualizar', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/permisos', () => ({ hasManagePerms: vi.fn().mockReturnValue(true) }))
    const update = vi.fn().mockResolvedValue({ id: 5, nombre: 'A', descripcion: '', imagenNombre: null, imagenUrl: null })
    const findUnique = vi.fn().mockResolvedValue(null)
    const hist = vi.fn().mockResolvedValue({})
    const tx = { almacen: { update, findUnique }, historialAlmacen: { create: hist } }
    const prismaMock = { usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) }, $transaction: vi.fn().mockImplementation(async (cb:any)=> cb(tx)) }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { PUT } = await import('../src/app/api/almacenes/[id]/route')
    const req = new NextRequest('http://localhost/api/almacenes/5', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'x' }),
    })
    const res = await PUT(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})

describe('DELETE /api/almacenes/[id]', () => {
  it('retorna auditoria al eliminar', async () => {
    vi.doMock('../lib/auth', () => ({ getUsuarioFromSession: vi.fn().mockResolvedValue({ id: 1 }) }))
    vi.doMock('../lib/permisos', () => ({ hasManagePerms: vi.fn().mockReturnValue(true) }))
    const tx = {
      almacen: { delete: vi.fn(), findUnique: vi.fn() },
      usuarioAlmacen: { deleteMany: vi.fn() },
      codigoAlmacen: { deleteMany: vi.fn() },
      movimiento: { deleteMany: vi.fn() },
      eventoAlmacen: { deleteMany: vi.fn() },
      novedadAlmacen: { deleteMany: vi.fn() },
      documentoAlmacen: { deleteMany: vi.fn() },
      incidencia: { deleteMany: vi.fn() },
      notificacion: { deleteMany: vi.fn() },
      alerta: { deleteMany: vi.fn() },
      historialLote: { deleteMany: vi.fn() },
      materialUnidad: { deleteMany: vi.fn() },
      archivoMaterial: { deleteMany: vi.fn() },
      material: { deleteMany: vi.fn() },
      historialAlmacen: { create: vi.fn() },
    }
    const prismaMock = {
      usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      $transaction: vi.fn().mockImplementation(async (cb:any)=> cb(tx))
    }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { DELETE } = await import('../src/app/api/almacenes/[id]/route')
    const req = new NextRequest('http://localhost/api/almacenes/5', { method: 'DELETE' })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})
