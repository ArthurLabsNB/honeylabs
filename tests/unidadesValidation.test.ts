import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => vi.restoreAllMocks())

describe('POST /api/materiales/[id]/unidades', () => {
  it('acepta decimales y campos vacios', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const prismaMock = {
      material: { findUnique: vi.fn().mockResolvedValue({ almacenId: 2 }) },
      usuarioAlmacen: { findFirst: vi.fn().mockResolvedValue({ id: 1 }) },
      materialUnidad: {
        create: vi.fn().mockResolvedValue({ id: 5, nombre: 'u', codigoQR: null }),
        findUnique: vi.fn().mockResolvedValue(null),
      },
      historialUnidad: { create: vi.fn().mockResolvedValue({}) },
    }
    vi.doMock('@lib/db/prisma', () => ({ prisma: prismaMock }))
    vi.doMock('../src/lib/audit', () => ({ logAudit: vi.fn() }))
    const registrarAuditoria = vi.fn().mockResolvedValue({})
    vi.doMock('../lib/reporter', () => ({ registrarAuditoria }))
    const { POST } = await import('../src/app/api/materiales/[id]/unidades/route')
    const body = JSON.stringify({ nombre: 'u', peso: 2.5, ancho: null })
    const req = new NextRequest('http://localhost/api/materiales/3/unidades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    const res = await POST(req)
    expect(res.status).toBe(200)
    vi.resetModules()
  })
})
