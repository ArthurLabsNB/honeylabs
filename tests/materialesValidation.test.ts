import { describe, it, expect, vi, afterEach } from 'vitest'
import { POST } from '../src/app/api/almacenes/[id]/materiales/route'
import { NextRequest } from 'next/server'
import prisma from '../lib/prisma'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'

afterEach(() => vi.restoreAllMocks())

describe('validaciones de materiales', () => {
  const baseReq = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  } as any

  it('rechaza cantidad negativa', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const body = JSON.stringify({ nombre: 'test', cantidad: -1 })
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rechaza fecha invalida', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const body = JSON.stringify({ nombre: 'test', cantidad: 1, fechaCaducidad: 'no-date' })
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rechaza reorderLevel negativo', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const body = JSON.stringify({ nombre: 'test', cantidad: 1, reorderLevel: -5 })
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('acepta datos parciales', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    vi.spyOn(prisma.usuarioAlmacen, 'findFirst').mockResolvedValue({ id: 1 } as any)
    const createMaterial = vi.fn().mockResolvedValue({ id: 2 })
    vi.spyOn(prisma, '$transaction').mockImplementation(async (cb: any) =>
      cb({
        material: { create: createMaterial, findUnique: vi.fn().mockResolvedValue(null) },
        usuarioAlmacen: { upsert: vi.fn().mockResolvedValue({}) },
        historialLote: { create: vi.fn().mockResolvedValue({}) },
      })
    )
    const { POST: handler } = await import('../src/app/api/almacenes/[id]/materiales/route')
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body: '{}' })
    const res = await handler(req)
    expect(res.status).toBe(200)
    vi.resetModules()
  })

  it('acepta decimales y campos vacios', async () => {
    const authMod = await import('../lib/auth')
    const permsMod = await import('../lib/permisos')
    const prismaMod = await import('../lib/prisma')
    vi.spyOn(authMod, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permsMod, 'hasManagePerms').mockReturnValue(true)
    vi.spyOn(prismaMod.default.usuarioAlmacen, 'findFirst').mockResolvedValue({ id: 1 } as any)
    const createMaterial = vi.fn().mockResolvedValue({ id: 3 })
    vi.spyOn(prismaMod.default, '$transaction').mockImplementation(async (cb: any) =>
      cb({
        material: { create: createMaterial, findUnique: vi.fn().mockResolvedValue(null) },
        usuarioAlmacen: { upsert: vi.fn().mockResolvedValue({}) },
        historialLote: { create: vi.fn().mockResolvedValue({}) },
      })
    )
    const { POST: handler } = await import('../src/app/api/almacenes/[id]/materiales/route')
    const body = JSON.stringify({ nombre: 'm', cantidad: 1.5 })
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body })
    const res = await handler(req)
    expect(res.status).toBe(200)
    vi.resetModules()
  })
})
