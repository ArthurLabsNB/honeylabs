import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import prisma from '../lib/prisma'

const { POST } = await import('../src/app/api/codigos/generar/route')

afterEach(() => vi.restoreAllMocks())

describe('POST /api/codigos/generar', () => {
  it('guarda rol asignado', async () => {
    const create = vi
      .spyOn(prisma.codigoAlmacen, 'create')
      .mockResolvedValue({ codigo: 'xyz' } as any)
    const req = new NextRequest('http://localhost/api/codigos/generar', {
      method: 'POST',
      body: JSON.stringify({ almacenId: 1, rolAsignado: 'edicion' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ rolAsignado: 'edicion' }),
      }),
    )
  })
})
