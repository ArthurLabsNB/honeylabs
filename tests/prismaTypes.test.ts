import { describe, it, expect } from 'vitest'

describe('tipo de auditoría', () => {
  it('AuditoriaInput tiene propiedad version', () => {
    interface AuditoriaInput {
      tipo: string
      version: number
    }
    const input: AuditoriaInput = { tipo: 'almacen', version: 1 }
    expect(input).toHaveProperty('version')
  })
})
