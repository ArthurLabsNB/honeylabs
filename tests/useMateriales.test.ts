import { describe, it, expect, vi, afterEach } from 'vitest'
import useMateriales from '../src/hooks/useMateriales'
import useSWR from 'swr'
import crypto from 'node:crypto'

vi.mock('react', () => ({
  useMemo: (fn: any) => fn(),
}))

vi.mock('swr', () => ({
  default: vi.fn(),
}))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useMateriales', () => {
  it('usa randomUUID del navegador si está disponible', () => {
    const rand = vi.fn().mockReturnValue('web-id')
    const originalCrypto = globalThis.crypto
    Object.defineProperty(globalThis, 'crypto', { value: { randomUUID: rand }, configurable: true })

    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({
      data: { materiales: [{ nombre: 'm1' }] },
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    })

    const { materiales } = useMateriales(1)

    expect(materiales[0].id).toBe('web-id')
    expect(rand).toHaveBeenCalled()
    Object.defineProperty(globalThis, 'crypto', { value: originalCrypto, configurable: true })
  })

  it('usa crypto.randomUUID si no hay UUID global', () => {
    const originalCrypto = globalThis.crypto
    Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true })
    const nodeRand = vi.spyOn(crypto, 'randomUUID').mockReturnValue('node-id')

    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({
      data: { materiales: [{ nombre: 'm1' }] },
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    })

    const { materiales } = useMateriales(1)

    expect(materiales[0].id).toBe('node-id')
    expect(nodeRand).toHaveBeenCalled()
    Object.defineProperty(globalThis, 'crypto', { value: originalCrypto, configurable: true })
  })
})
