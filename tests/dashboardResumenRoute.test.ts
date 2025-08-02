import { describe, it, expect, vi, afterEach } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
})

describe('dashboard resumen api', () => {
  it('returns section counts', async () => {
    const counts = {
      almacen: 2,
      material: 3,
      material_unidad: 4,
      auditoria: 5,
      panel: 6,
      movimiento: 7,
    }
    const from = vi.fn((table: string) => ({
      select: vi.fn().mockResolvedValue({
        count: counts[table as keyof typeof counts],
        error: null,
      }),
    }))

    vi.doMock('@lib/db', () => ({ getDb: () => ({ client: { from } }) }))

    const { GET } = await import('../src/app/api/dashboard/resumen/route')
    const res = await GET()

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({
      almacenes: 2,
      materiales: 3,
      unidades: 4,
      auditorias: 5,
      paneles: 6,
      inventario: 7,
    })
    expect(from).toHaveBeenCalledTimes(6)
  })
})

