import { describe, it, expect, vi, afterEach } from 'vitest'
import { POST } from '../src/app/api/almacenes/compartir/route'
import { NextRequest } from 'next/server'
import prisma from '../lib/prisma'
import * as auth from '../lib/auth'
import * as email from '../src/lib/email/enviarInvitacionAlmacen'

afterEach(() => vi.restoreAllMocks())

describe('POST /api/almacenes/compartir', () => {
  it('requiere sesion', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/almacenes/compartir', { method: 'POST', body: '{}' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('asocia usuario y decrementa usos', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    const code = {
      id: 9,
      almacenId: 2,
      codigo: 'abc',
      rolAsignado: 'visualizacion',
      permisos: null,
      usosDisponibles: 1,
      activo: true,
      fechaExpiracion: null,
    }
    vi.spyOn(prisma.codigoAlmacen, 'findUnique').mockResolvedValue(code as any)
    const upsert = vi.spyOn(prisma.usuarioAlmacen, 'upsert').mockResolvedValue({} as any)
    const update = vi.spyOn(prisma.codigoAlmacen, 'update').mockResolvedValue({} as any)

    const req = new NextRequest('http://localhost/api/almacenes/compartir', {
      method: 'POST',
      body: JSON.stringify({ codigo: 'abc' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ rolEnAlmacen: 'visualizacion' }),
      }),
    )
    expect(update).toHaveBeenCalled()
  })

  it('envia invitaciones por correo', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ id: 1 } as any)
    vi.spyOn(prisma.codigoAlmacen, 'findUnique').mockResolvedValue({ activo: true } as any)
    const enviar = vi.spyOn(email, 'enviarInvitacionAlmacen').mockResolvedValue({ enviado: true })

    const req = new NextRequest('http://localhost/api/almacenes/compartir', {
      method: 'POST',
      body: JSON.stringify({ codigo: 'abc', correos: ['a@x.com'] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(enviar).toHaveBeenCalledWith({
      correos: ['a@x.com'],
      enlace: expect.any(String),
    })
  })
})
