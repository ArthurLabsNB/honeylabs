import { describe, it, expect, vi, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { SESSION_COOKIE } from '@lib/constants'

// Mock Supabase client creation
const from = vi.fn((table: string) => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  }
  if (table === 'sesion_usuario') {
    chain.maybeSingle.mockResolvedValue({ data: { id: 1 } })
  } else if (table === 'usuario') {
    chain.maybeSingle.mockResolvedValue({
      data: {
        id: 1,
        nombre: 'test',
        correo: 't@example.com',
        tipo_cuenta: 'admin',
        rol: 'admin',
        preferencias: '{}',
        plan: null,
        roles: [],
      },
    })
  } else {
    chain.maybeSingle.mockResolvedValue({ data: null })
  }
  return chain
})
const createClient = vi.fn(() => ({ from }))
vi.mock('@supabase/supabase-js', () => ({ createClient }))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('sesión con SupabaseAdapter', () => {
  it('resuelve usuario usando SupabaseAdapter', async () => {
    process.env.JWT_SECRET = 'test-secret'
    process.env.SUPABASE_URL = 'http://supabase.local'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
    delete process.env.DB_PROVIDER

    const token = jwt.sign({ id: 1, sid: 1 }, 'test-secret')
    const req = { cookies: { get: (n: string) => (n === SESSION_COOKIE ? { value: token } : undefined) } }

    const { getUsuarioFromSession } = await import('../lib/auth')
    const usuario = await getUsuarioFromSession(req as any)

    expect(usuario).toMatchObject({ id: 1 })
    expect(createClient).toHaveBeenCalled()
  })
})
