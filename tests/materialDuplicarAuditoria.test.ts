import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('POST /api/materiales/[id]/duplicar', () => {
  it('retorna auditoria al duplicar', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const material = {
      nombre: 'mat',
      descripcion: '',
      miniatura: null,
      miniaturaNombre: null,
      cantidad: 1,
      unidad: 'u',
      lote: null,
      fechaCaducidad: null,
      ubicacion: null,
      proveedor: null,
      estado: null,
      observaciones: null,
      codigoBarra: null,
      codigoQR: null,
      minimo: null,
      maximo: null,
      reorderLevel: null,
      almacenId: 2,
      archivos: [] as any[],
    }
    const tx = {
      material: { create: vi.fn().mockResolvedValue({ id: 6, nombre: 'm copia' }) },
      archivoMaterial: { create: vi.fn() },
    }
    const prismaMock = {
      material: { findUnique: vi.fn().mockResolvedValue(material) },
      usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      $transaction: vi.fn().mockImplementation(async (cb: any) => cb(tx)),
    }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    const registrarAuditoria = vi.fn().mockResolvedValue({ auditoria: { id: 9 } })
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { POST } = await import('../src/app/api/materiales/[id]/duplicar/route')
    const req = new NextRequest('http://localhost/api/materiales/5/duplicar', {
      method: 'POST',
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.auditoria).toEqual({ id: 9 })
    expect(registrarAuditoria).toHaveBeenCalled()
  })
})
