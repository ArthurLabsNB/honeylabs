import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/db/prisma'
import * as auth from '../lib/auth'

const { GET, POST } = await import('../src/app/api/dashboard/layout/route')

afterEach(() => vi.restoreAllMocks())

describe('dashboard layout api', () => {
  it('returns stored layout', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({
      preferencias: JSON.stringify({ dashboardLayout: { b1: [{ id: 'a' }] } })
    } as any)
    const res = await GET()
    const data = await res.json()
    expect(data.b1[0].id).toBe('a')
  })

  it('merges board tabs on POST', async () => {
    const user = {
      id: 1,
      preferencias: JSON.stringify({ dashboardLayout: { b1: [{ id: 'a' }] } })
    }
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(user as any)
    const update = vi.spyOn(prisma.usuario, 'update').mockResolvedValue({} as any)
    const body = JSON.stringify({ b2: [{ id: 'b' }] })
    const req = new NextRequest('http://localhost/api/dashboard/layout', { method: 'POST', body })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        preferencias: JSON.stringify({
          dashboardLayout: { b1: [{ id: 'a' }], b2: [{ id: 'b' }] }
        })
      }
    })
  })
})
