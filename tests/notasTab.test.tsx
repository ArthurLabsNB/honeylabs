import { describe, it, expect, vi, afterEach } from 'vitest'
import useNotas from '../src/hooks/useNotas'
import useSWR from 'swr'

vi.mock('swr', () => ({ default: vi.fn() }))

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('useNotas', () => {
  it('crear envia json y muta', async () => {
    const mutate = vi.fn()
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: { notas: [] }, error: null, isLoading: false, mutate })
    const apiFetch = vi.fn().mockResolvedValue(new Response('{"nota":{}}', { status: 201, headers: { 'Content-Type': 'application/json' } }))
    vi.doMock('../lib/api', () => ({ apiFetch, apiPath: (p: string) => p }))
    const { default: useNotasHook } = await import('../src/hooks/useNotas')
    const { crear } = useNotasHook('t1')
    await crear('url', 'http://x')
    expect(apiFetch).toHaveBeenCalled()
    expect(mutate).toHaveBeenCalled()
    vi.resetModules()
  })

  it('actualizar llama api', async () => {
    const mutate = vi.fn()
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: { notas: [] }, error: null, isLoading: false, mutate })
    const apiFetch = vi.fn().mockResolvedValue(new Response('{"nota":{}}', { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.doMock('../lib/api', () => ({ apiFetch, apiPath: (p: string) => p }))
    const { default: useNotasHook } = await import('../src/hooks/useNotas')
    const { actualizar } = useNotasHook('t1')
    await actualizar(2, 'nuevo')
    expect(apiFetch).toHaveBeenCalled()
    expect(mutate).toHaveBeenCalled()
    vi.resetModules()
  })
})
