import { describe, it, expect, vi, afterEach } from 'vitest'
import useMateriales from '../src/hooks/useMateriales'
import useSWR from 'swr'
import * as uuidFns from '../src/lib/uuid'
import { materialSchema } from '../src/lib/validators/material'

vi.mock('react', () => ({
  useMemo: (fn: any) => fn(),
}))

vi.mock('swr', () => ({
  default: vi.fn(),
}))

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
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

  it('usa uuid.v4 si no hay UUID global', () => {
    const originalCrypto = globalThis.crypto
    Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true })
    const nodeRand = vi.spyOn(uuidFns, 'generarUUID').mockReturnValue('node-id')

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

  it('crear genera FormData valida', async () => {
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: null, error: null, isLoading: false, mutate: vi.fn() })
    const apiFetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.doMock('../lib/api', () => ({ apiFetch, apiPath: (p: string) => p }))
    const { default: useMats } = await import('../src/hooks/useMateriales')
    const { crear } = useMats(1)
    await crear({ id: '1', nombre: 'mat', cantidad: 2, lote: 'l1', fechaCaducidad: '' } as any)
    const form = apiFetch.mock.calls[0][1].body as FormData
    const obj = Object.fromEntries(Array.from(form.entries()))
    expect(materialSchema.safeParse(obj).success).toBe(true)
    expect(form.has('fechaCaducidad')).toBe(false)
    vi.resetModules()
  })

  it('actualizar genera FormData valida', async () => {
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: null, error: null, isLoading: false, mutate: vi.fn() })
    const apiFetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.doMock('../lib/api', () => ({ apiFetch, apiPath: (p: string) => p }))
    const { default: useMats } = await import('../src/hooks/useMateriales')
    const { actualizar } = useMats(1)
    await actualizar({ id: '1', dbId: 3, nombre: 'mat', cantidad: 2, lote: 'l1', fechaCaducidad: '2024-01-01' } as any)
    const form = apiFetch.mock.calls[0][1].body as FormData
    const obj = Object.fromEntries(Array.from(form.entries()))
    expect(materialSchema.safeParse(obj).success).toBe(true)
    expect(form.get('fechaCaducidad')).toBe('2024-01-01')
    vi.resetModules()
  })

  it('eliminar notifica exito', async () => {
    const mutate = vi.fn()
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: null, error: null, isLoading: false, mutate })
    const apiFetch = vi.fn().mockResolvedValue(
      new Response('{"success":true}', { status: 200, headers: { 'Content-Type': 'application/json' } })
    )
    vi.doMock('../lib/api', () => ({ apiFetch, apiPath: (p: string) => p }))
    const { default: useMats } = await import('../src/hooks/useMateriales')
    const { eliminar } = useMats(1)
    const res = await eliminar(2)
    expect(res.success).toBe(true)
    expect(mutate).toHaveBeenCalled()
    vi.resetModules()
  })

  it('eliminar devuelve error', async () => {
    const mutate = vi.fn()
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({ data: null, error: null, isLoading: false, mutate })
    const apiFetch = vi.fn().mockResolvedValue(
      new Response('{"error":"fail"}', { status: 400, headers: { 'Content-Type': 'application/json' } })
    )
    vi.doMock('../lib/api', () => ({ apiFetch, apiPath: (p: string) => p }))
    const { default: useMats } = await import('../src/hooks/useMateriales')
    const { eliminar } = useMats(1)
    const res = await eliminar(2)
    expect(res.success).toBe(false)
    expect(res.error).toBe('fail')
    expect(mutate).not.toHaveBeenCalled()
    vi.resetModules()
  })

  it('incluye apiPath en miniaturaUrl', async () => {
    const swr = useSWR as unknown as ReturnType<typeof vi.fn>
    swr.mockReturnValue({
      data: { materiales: [{ nombre: 'm1', miniaturaNombre: 'img.png' }] },
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    })
    vi.doMock('../lib/api', () => ({
      apiFetch: vi.fn(),
      apiPath: (p: string) => '/base' + p,
    }))
    const { default: useMats } = await import('../src/hooks/useMateriales')
    const { materiales } = useMats(1)
    expect(materiales[0].miniaturaUrl).toBe(
      '/base/api/materiales/archivo?nombre=img.png',
    )
    vi.resetModules()
  })
})
