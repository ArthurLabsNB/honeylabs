import { describe, it, expect, vi, afterEach } from 'vitest'
import useUnidades from '../src/hooks/useUnidades'
import useSWR from 'swr'

vi.mock('swr', () => ({ default: vi.fn() }))

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('useUnidades', () => {
  it('eliminar notifica exito', async () => {
    const mutate = vi.fn()
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: { unidades: [] }, error: null, isLoading: false, mutate })
    const apiFetch = vi.fn().mockResolvedValue(
      new Response('{"success":true}', { status: 200, headers: { 'Content-Type': 'application/json' } })
    )
    vi.doMock('../lib/api', () => ({ apiFetch, apiPath: (p: string) => p }))
    const { default: useUnidadesHook } = await import('../src/hooks/useUnidades')
    const { eliminar } = useUnidadesHook(1)
    const res = await eliminar(2)
    expect(res.success).toBe(true)
    expect(mutate).toHaveBeenCalled()
    vi.resetModules()
  })

  it('eliminar devuelve error', async () => {
    const mutate = vi.fn()
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: { unidades: [] }, error: null, isLoading: false, mutate })
    const apiFetch = vi.fn().mockResolvedValue(
      new Response('{"error":"fail"}', { status: 400, headers: { 'Content-Type': 'application/json' } })
    )
    vi.doMock('../lib/api', () => ({ apiFetch, apiPath: (p: string) => p }))
    const { default: useUnidadesHook } = await import('../src/hooks/useUnidades')
    const { eliminar } = useUnidadesHook(1)
    const res = await eliminar(2)
    expect(res.success).toBe(false)
    expect(res.error).toBe('fail')
    expect(mutate).not.toHaveBeenCalled()
    vi.resetModules()
  })
})
