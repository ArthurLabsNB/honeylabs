import { describe, it, expect, vi, afterEach } from 'vitest'
import useSession, { sessionFetcher } from '../src/hooks/useSession'
import useSWR from 'swr'

vi.mock('swr', () => ({
  default: vi.fn(),
  mutate: vi.fn(),
}))

afterEach(() => vi.restoreAllMocks())

describe('useSession', () => {
  it('devuelve usuario null cuando /api/login responde 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response('{"success":false}', { status: 401, headers: { 'Content-Type': 'application/json' } })
    ))
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    const data = await sessionFetcher('/api/login')
    swr.mockReturnValue({ data, isLoading: false })
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { usuario } = useSession()

    expect(usuario).toBeNull()
    expect(consoleError).not.toHaveBeenCalled()
  })
})
