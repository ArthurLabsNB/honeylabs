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

  it('retorna error cuando fetch falla', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('net'))
    vi.stubGlobal('fetch', fetchMock)
    const { registrarAuditoria } = await import('../lib/reporter')
    const { NextRequest } = await import('next/server')
    const req = new NextRequest('http://localhost/api/test')
    const result = await registrarAuditoria(req, 'almacen', 1, 'creacion', {})
    expect(result).toEqual({ error: 'Error de red al crear reporte' })
    vi.unstubAllGlobals()
  })
})
