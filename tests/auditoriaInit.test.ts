import { describe, it, expect, vi, afterEach } from 'vitest'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('ensureAuditoriaTables', () => {
  it('invoca rpc para crear tablas', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: null })
    vi.doMock('@lib/db', () => ({ getDb: () => ({ client: { rpc } }) }))
    const { ensureAuditoriaTables } = await import('../lib/auditoriaInit')

    await ensureAuditoriaTables()

    expect(rpc).toHaveBeenCalledWith('ensure_auditoria_tables')
  })
})
