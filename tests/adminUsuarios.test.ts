import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../src/app/api/admin/usuarios/route'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/db/prisma'

afterEach(() => vi.restoreAllMocks())

describe('admin usuarios', () => {
  it('retorna 400 si take no es numerico', async () => {
    vi.spyOn(prisma.usuario, 'findMany').mockResolvedValue([] as any)
    const req = new NextRequest('http://localhost/api/admin/usuarios?take=abc')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })
})
