import { describe, it, expect, vi, afterEach } from 'vitest'
import useAuditorias from '../src/hooks/useAuditorias'
import useSWR from 'swr'

vi.mock('swr', () => ({ default: vi.fn() }))

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('useAuditorias', () => {
  it('agrega usuarioId en la url', async () => {
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: { auditorias: [] }, error: null, isLoading: false })
    const { default: useAud } = await import('../src/hooks/useAuditorias')
    useAud({ usuarioId: 5 })
    expect(swr).toHaveBeenCalledWith('/api/auditorias?usuarioId=5', expect.any(Function), expect.any(Object))
  })
})
