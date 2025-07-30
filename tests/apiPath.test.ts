import { describe, it, expect, vi } from 'vitest'

// Este test asegura que apiPath maneja BASE_PATH con barra final

describe('apiPath', () => {
  it('elimina barra final en BASE_PATH', async () => {
    const original = process.env.NEXT_PUBLIC_BASE_PATH
    process.env.NEXT_PUBLIC_BASE_PATH = '/base/'
    const mod = await import('../lib/api')
    expect(mod.apiPath('/api/perfil')).toBe('/base/api/perfil')
    vi.resetModules()
    process.env.NEXT_PUBLIC_BASE_PATH = original
  })
})
