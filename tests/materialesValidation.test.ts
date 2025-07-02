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
})
