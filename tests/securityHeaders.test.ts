import { describe, it, expect, vi } from 'vitest'

const loadModule = async () => {
  vi.resetModules()
  return await import('../lib/securityHeaders')
}

describe('security headers', () => {
  it('production CSP incluye frame-src para Google', async () => {
    process.env.NODE_ENV = 'production'
    const { ContentSecurityPolicy } = await loadModule()
    expect(ContentSecurityPolicy).toContain("frame-src 'self' https://www.google.com;")
  })

  it('next.config usa securityHeaders', async () => {
    process.env.NODE_ENV = 'production'
    const { securityHeaders } = await loadModule()
    const config = (await import('../next.config')).default
    const res = await config.headers()
    expect(res[0].headers).toBe(securityHeaders)
  })
})
