import { describe, it, expect, vi, afterEach } from 'vitest'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('ensureAuditoriaTables', () => {
  it('crea tablas con columna version', async () => {
    const query = vi.fn().mockResolvedValue([{ exists: false }])
    const exec = vi.fn()
    const prismaMock = { $queryRaw: query, $executeRawUnsafe: exec }
    vi.doMock('../lib/prisma', () => ({ default: prismaMock }))
    const { ensureAuditoriaTables } = await import('../lib/auditoriaInit')

    await ensureAuditoriaTables()

    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining('"version" INTEGER NOT NULL DEFAULT 1')
    )
    vi.unmock('../lib/prisma')
  })
})
