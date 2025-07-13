import { describe, it, expect, vi } from 'vitest'

describe('logAudit', () => {
  it('ejecuta inserción en AuditLog', async () => {
    const spy = vi.fn()
    vi.doMock('../lib/prisma', () => ({ default: { $executeRawUnsafe: spy } }))
    const { logAudit } = await import('../src/lib/audit')
    await logAudit(1, 'creacion', 'almacen', { foo: 'bar' })
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO "AuditLog"'),
      1,
      'creacion',
      'almacen',
      JSON.stringify({ foo: 'bar' })
    )
    vi.unmock('../lib/prisma')
  })
})
