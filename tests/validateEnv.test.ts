import { describe, it, expect, afterEach } from 'vitest'
import validateEnv from '../lib/validateEnv'

const backup = {
  NODE_ENV: process.env.NODE_ENV,
  DB_PROVIDER: process.env.DB_PROVIDER,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  VITEST: process.env.VITEST,
}

afterEach(() => {
  if (backup.NODE_ENV === undefined) delete process.env.NODE_ENV
  else process.env.NODE_ENV = backup.NODE_ENV

  if (backup.DB_PROVIDER === undefined) delete process.env.DB_PROVIDER
  else process.env.DB_PROVIDER = backup.DB_PROVIDER

  if (backup.SUPABASE_URL === undefined) delete process.env.SUPABASE_URL
  else process.env.SUPABASE_URL = backup.SUPABASE_URL

  if (backup.SUPABASE_SERVICE_ROLE_KEY === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY
  else process.env.SUPABASE_SERVICE_ROLE_KEY = backup.SUPABASE_SERVICE_ROLE_KEY

  if (backup.VITEST === undefined) delete process.env.VITEST
  else process.env.VITEST = backup.VITEST
})

describe('validateEnv supabase', () => {
  it('lanza error si falta SUPABASE_URL', () => {
    process.env.NODE_ENV = 'production'
    process.env.DB_PROVIDER = 'supabase'
    delete process.env.SUPABASE_URL
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'key'
    delete process.env.VITEST

    expect(() => validateEnv()).toThrow(/SUPABASE_URL/)
  })

  it('lanza error si falta SUPABASE_SERVICE_ROLE_KEY', () => {
    process.env.NODE_ENV = 'production'
    process.env.DB_PROVIDER = 'supabase'
    process.env.SUPABASE_URL = 'http://local'
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    delete process.env.VITEST

    expect(() => validateEnv()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/)
  })
})
