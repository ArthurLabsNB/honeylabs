import { describe, it, expect, vi, afterEach } from 'vitest'
import { hasCamera, fetchScanInfo } from '../src/lib/scanUtils'

vi.mock('../lib/api', () => ({ apiFetch: vi.fn() }))
vi.mock('../lib/http', () => ({ jsonOrNull: vi.fn(() => Promise.resolve({ ok: true })) }))

const { apiFetch } = await import('../lib/api')
const { jsonOrNull } = await import('../lib/http')

afterEach(() => {
  vi.restoreAllMocks()
  delete (navigator as any).mediaDevices
})

describe('hasCamera', () => {
  it('detecta camara disponible', async () => {
    ;(navigator as any).mediaDevices = {
      enumerateDevices: vi.fn().mockResolvedValue([{ kind: 'videoinput' }]),
    }
    expect(await hasCamera()).toBe(true)
  })

  it('retorna false si falla', async () => {
    ;(navigator as any).mediaDevices = {
      enumerateDevices: vi.fn().mockRejectedValue(new Error('err')),
    }
    expect(await hasCamera()).toBe(false)
  })
})

describe('fetchScanInfo', () => {
  it('envia codigo al API', async () => {
    ;(apiFetch as any).mockResolvedValue(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }))
    await fetchScanInfo('abc')
    expect(apiFetch).toHaveBeenCalled()
    expect(jsonOrNull).toHaveBeenCalled()
  })
})
