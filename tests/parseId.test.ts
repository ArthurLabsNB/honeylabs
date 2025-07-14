import { describe, it, expect } from 'vitest'
import { parseId } from '../src/lib/parseId'

describe('parseId', () => {
  it('retorna el id cuando es válido', () => {
    expect(parseId('5')).toBe(5)
    expect(parseId(3)).toBe(3)
  })

  it('retorna null con valores inválidos', () => {
    expect(parseId(undefined)).toBeNull()
    expect(parseId(null)).toBeNull()
    expect(parseId('abc')).toBeNull()
    expect(parseId(0)).toBeNull()
    expect(parseId(-1)).toBeNull()
  })
})
