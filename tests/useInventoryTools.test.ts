import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  exportCSV,
  bulkUpdateStocks,
  generateQRBatch,
} from '../src/app/dashboard/almacenes/inventario/page'

var fetchMock: any
vi.mock('../lib/api', () => ({ apiFetch: (...args: any[]) => fetchMock(...args) }))
vi.mock('../lib/http', () => ({ jsonOrNull: vi.fn(async (r:any) => (r.json ? r.json() : {})) }))

describe('useInventoryTools', () => {
  beforeEach(() => {
    fetchMock = vi.fn()
    ;(global as any).document = {
      createElement: () => ({ click: vi.fn(), remove: vi.fn(), href: '', download: '' }),
      body: { appendChild: vi.fn(), removeChild: vi.fn() },
    }
    ;(global as any).URL = { createObjectURL: vi.fn(() => 'u'), revokeObjectURL: vi.fn() }
  })

  it('exporta csv', async () => {
    const blob = new Blob(['csv'])
    fetchMock.mockResolvedValue({ ok: true, blob: async () => blob })
    await exportCSV('material')
    expect(fetchMock).toHaveBeenCalledWith('/api/archivos/export?tipo=material&formato=csv')
  })

  it('actualiza stocks en lote', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    await bulkUpdateStocks([
      { id: 1, cantidad: 2 },
      { id: 3, cantidad: 4 },
    ])
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('/api/materiales/1/ajuste', expect.any(Object))
  })

  it('genera codigos QR por lote', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ codigo: 'x' }) })
    const cods = await generateQRBatch(5, 3)
    expect(cods.length).toBe(3)
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
