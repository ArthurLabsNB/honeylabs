import { describe, it, expect, afterEach } from 'vitest'
import { resolveDatabaseUrl } from '../lib/prisma'

const clean = () => {
  delete process.env.PRISMA_DATA_PROXY
  delete process.env.DATABASE_URL
}

describe('resolveDatabaseUrl', () => {
  afterEach(clean)

  it('corrige prefijo prisma+postgres', () => {
    process.env.DATABASE_URL = 'prisma+postgres://example'
    expect(resolveDatabaseUrl()).toBe('prisma+postgresql://example')
  })

  it('agrega prisma+ con data proxy', () => {
    process.env.DATABASE_URL = 'postgresql://db'
    process.env.PRISMA_DATA_PROXY = 'true'
    expect(resolveDatabaseUrl()).toBe('prisma+postgresql://db')
  })
})

