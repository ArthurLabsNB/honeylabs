import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/db/prisma'
;(prisma as any).factura = { create: vi.fn() }
const { POST } = await import('../src/app/api/billing/route')

afterEach(() => vi.restoreAllMocks())

describe('POST /api/billing', () => {
  it('valida datos requeridos', async () => {
    const req = new NextRequest('http://localhost/api/billing', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('crea factura', async () => {
    const create = vi
      .spyOn(prisma.factura, 'create')
      .mockResolvedValue({ id: 1, folio: 'A1', total: 10 } as any)
    const req = new NextRequest('http://localhost/api/billing', {
      method: 'POST',
      body: JSON.stringify({ folio: 'A1', clienteRfc: 'AAA010101AAA', total: 10 }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(create).toHaveBeenCalled()
  })
})
