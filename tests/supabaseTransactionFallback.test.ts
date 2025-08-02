import { describe, it, expect, vi, afterEach } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  delete process.env.SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
})

describe('SupabaseAdapter sin RPCs de transacción', () => {
  it('ejecuta sin commit/rollback cuando tx_* no existe', async () => {
    const rpc = vi.fn().mockRejectedValue(new Error('not found'))
    const createClient = vi.fn(() => ({ rpc }))
    vi.doMock('@supabase/supabase-js', () => ({ createClient }))

    process.env.SUPABASE_URL = 'http://supabase.local'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'

    const { SupabaseAdapter } = await import('../lib/db/supabase')
    const fn = vi.fn().mockResolvedValue('ok')

    const res = await SupabaseAdapter.transaction(fn)

    expect(res).toBe('ok')
    expect(fn).toHaveBeenCalled()
    expect(rpc).toHaveBeenCalledTimes(1)
    expect(rpc).toHaveBeenCalledWith('tx_begin')
  })

  it('propaga errores sin rollback', async () => {
    const rpc = vi.fn().mockRejectedValue(new Error('not found'))
    const createClient = vi.fn(() => ({ rpc }))
    vi.doMock('@supabase/supabase-js', () => ({ createClient }))

    process.env.SUPABASE_URL = 'http://supabase.local'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'

    const { SupabaseAdapter } = await import('../lib/db/supabase')
    const fn = vi.fn().mockRejectedValue(new Error('fail'))

    await expect(SupabaseAdapter.transaction(fn)).rejects.toThrow('fail')
    expect(rpc).toHaveBeenCalledTimes(1)
    expect(rpc).toHaveBeenCalledWith('tx_begin')
  })
})
