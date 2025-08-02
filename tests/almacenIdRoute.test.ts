import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../src/app/api/almacenes/[id]/route'
import { NextRequest } from 'next/server'
import * as auth from '../lib/auth'
import * as permisos from '../lib/permisos'
import * as db from '../lib/db'

afterEach(() => vi.restoreAllMocks())

describe('GET /api/almacenes/[id]', () => {
  it('rechaza si no pertenece y no es admin', async () => {
    const from = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    }))
    vi.spyOn(db, 'getDb').mockReturnValue({ client: { from } } as any)
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(permisos, 'hasManagePerms').mockReturnValue(false)
    const req = new NextRequest('http://localhost/api/almacenes/5')
    const res = await GET(req)
    expect(res.status).toBe(403)
  })
})
