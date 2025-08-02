import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { POST } from '../src/app/api/almacenes/[id]/materiales/route'
import * as reporter from '../lib/reporter'
import { NextRequest } from 'next/server'
import * as db from '../lib/db'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'
import * as snapshot from '../src/lib/snapshot'
import * as audit from '../src/lib/audit'

afterEach(() => vi.restoreAllMocks())

beforeEach(() => {
  vi.spyOn(reporter, 'registrarAuditoria').mockResolvedValue({})
})

describe('validaciones de materiales', () => {
  const baseReq = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  } as any

  it('rechaza cantidad negativa', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    const body = JSON.stringify({ nombre: 'test', cantidad: -1 })
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rechaza fecha invalida', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    const body = JSON.stringify({ nombre: 'test', cantidad: 1, fechaCaducidad: 'no-date' })
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rechaza reorderLevel negativo', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    const body = JSON.stringify({ nombre: 'test', cantidad: 1, reorderLevel: -5 })
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('acepta datos parciales', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(true)
    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    }))
    const txFrom = (table: string) => {
      if (table === 'material') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 2, nombre: '', miniaturaNombre: null }, error: null }),
            }),
          }),
        }
      }
      if (table === 'usuario_almacen') {
        return { upsert: vi.fn().mockResolvedValue({ data: {}, error: null }) }
      }
      return {}
    }
    vi.spyOn(db, 'getDb').mockReturnValue({
      client: { from },
      transaction: (cb: any) => cb({ from: txFrom }),
    } as any)
    vi.spyOn(snapshot, 'snapshotMaterial').mockResolvedValue(undefined as any)
    vi.spyOn(audit, 'logAudit').mockResolvedValue(undefined as any)
    const { POST: handler } = await import('../src/app/api/almacenes/[id]/materiales/route')
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body: '{}' })
    const res = await handler(req)
    expect(res.status).toBe(200)
    vi.resetModules()
  })

  it('acepta decimales y campos vacios', async () => {
    const authMod = await import('../lib/auth')
    const permsMod = await import('../lib/permisos')
    const dbMod = await import('../lib/db')
    vi.spyOn(authMod, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permsMod, 'hasManagePerms').mockReturnValue(true)
    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    }))
    const txFrom = (table: string) => {
      if (table === 'material') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 3, nombre: '', miniaturaNombre: null }, error: null }),
            }),
          }),
        }
      }
      if (table === 'usuario_almacen') {
        return { upsert: vi.fn().mockResolvedValue({ data: {}, error: null }) }
      }
      return {}
    }
    vi.spyOn(dbMod, 'getDb').mockReturnValue({
      client: { from },
      transaction: (cb: any) => cb({ from: txFrom }),
    } as any)
    vi.spyOn(snapshot, 'snapshotMaterial').mockResolvedValue(undefined as any)
    vi.spyOn(audit, 'logAudit').mockResolvedValue(undefined as any)
    const { POST: handler } = await import('../src/app/api/almacenes/[id]/materiales/route')
    const body = JSON.stringify({ nombre: 'm', cantidad: 1.5 })
    const req = new NextRequest('http://localhost/api/almacenes/1/materiales', { ...baseReq, body })
    const res = await handler(req)
    expect(res.status).toBe(200)
    vi.resetModules()
  })
})
