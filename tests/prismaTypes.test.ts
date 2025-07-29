import { describe, it, expect } from 'vitest'

describe('prisma types', () => {
  it('AuditoriaCreateInput tiene propiedad version', () => {
    const input: import('@prisma/client').Prisma.AuditoriaCreateInput = {
      tipo: 'almacen',
      version: 1,
    }
    expect(input).toHaveProperty('version')
  })
})
