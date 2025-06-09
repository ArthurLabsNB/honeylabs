import { describe, it, expect, afterEach } from 'vitest'
import { generarUUID } from '../src/lib/uuid'

const originalCrypto = globalThis.crypto

afterEach(() => {
  Object.defineProperty(globalThis, 'crypto', { value: originalCrypto, configurable: true })
})

describe('generarUUID', () => {
  it('usa randomUUID si está disponible', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: { randomUUID: () => 'mocked-uuid' },
      configurable: true,
    })
    expect(generarUUID()).toBe('mocked-uuid')
  })

  it('usa fallback si no hay randomUUID', () => {
    Object.defineProperty(globalThis, 'crypto', { value: {}, configurable: true })
    const uuid = generarUUID()
    expect(typeof uuid).toBe('string')
    expect(uuid.length).toBeGreaterThan(10)
  })
})
