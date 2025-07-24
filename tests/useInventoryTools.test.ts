import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportCSV, bulkUpdateStocks, generateQRBatch } from '../src/app/dashboard/almacenes/utilidades/useInventoryTools'

vi.mock('../src/hooks/useSession', () => ({ __esModule: true, default: () => ({ usuario: { id: 5 } }) }))
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
})
