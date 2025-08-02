import { describe, it, expect, vi, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { SESSION_COOKIE } from '@lib/constants'

vi.mock('@lib/db', () => ({ getDb: vi.fn() }))

process.env.JWT_SECRET = 'test-secret'
process.env.DB_PROVIDER = 'prisma'

const { getDb } = await import('@lib/db')
const { getUsuarioFromSession } = await import('../lib/auth')

afterEach(() => {
  vi.restoreAllMocks()
  process.env.DB_PROVIDER = 'prisma'
})

describe('getUsuarioFromSession', () => {
  it('retorna usuario con prisma', async () => {
    process.env.JWT_SECRET = 'test-secret'
    process.env.DB_PROVIDER = 'prisma'

    const token = jwt.sign({ id: 1, sid: 1 }, 'test-secret')
    const req = {
      cookies: { get: (name: string) => (name === SESSION_COOKIE ? { value: token } : undefined) },
    }

    const usuario = {
      id: 1,
      nombre: 'Test',
      correo: 'test@example.com',
      tipoCuenta: 'individual',
      entidadId: null,
      esSuperAdmin: false,
      roles: [{ nombre: 'user' }],
      plan: { nombre: 'free' },
      preferencias: null,
    }

    const sesionUsuario = {
      findUnique: vi.fn().mockResolvedValue({ activa: true, usuarioId: 1 }),
      update: vi.fn().mockResolvedValue(undefined),
    }
    const usuarioModel = { findUnique: vi.fn().mockResolvedValue(usuario) }

    vi.mocked(getDb).mockReturnValue({ client: { sesionUsuario, usuario: usuarioModel } as any })

    const res = await getUsuarioFromSession(req as any)
    expect(res).toEqual(usuario)
    expect(sesionUsuario.update).toHaveBeenCalledOnce()
  })

  it('retorna usuario con supabase', async () => {
    process.env.JWT_SECRET = 'test-secret'
    process.env.DB_PROVIDER = 'supabase'

    const token = jwt.sign({ id: 1, sid: 1 }, 'test-secret')
    const req = {
      cookies: { get: (name: string) => (name === SESSION_COOKIE ? { value: token } : undefined) },
    }

    const usuario = {
      id: 1,
      nombre: 'Test',
      correo: 'test@example.com',
      tipoCuenta: 'individual',
      entidadId: null,
      esSuperAdmin: false,
      roles: [{ nombre: 'user' }],
      plan: { nombre: 'free' },
      preferencias: null,
    }

    const supabase = {
      from: vi.fn((table: string) => {
        if (table === 'SesionUsuario') {
          return {
            select: () => ({
              eq: () => ({ maybeSingle: () => Promise.resolve({ data: { activa: true, usuarioId: 1 } }) }),
            }),
            update: () => ({ eq: () => Promise.resolve({}) }),
          }
        }
        if (table === 'Usuario') {
          return {
            select: () => ({
              eq: () => ({ maybeSingle: () => Promise.resolve({ data: usuario }) }),
            }),
          }
        }
        throw new Error('tabla desconocida')
      }),
    }

    vi.mocked(getDb).mockReturnValue({ client: supabase as any })

    const res = await getUsuarioFromSession(req as any)
    expect(res).toEqual(usuario)
    expect(supabase.from).toHaveBeenCalledWith('SesionUsuario')
    expect(supabase.from).toHaveBeenCalledWith('Usuario')
  })
})

