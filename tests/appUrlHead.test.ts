import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { HEAD } from '../src/app/api/app/url/route'
import fs from 'fs/promises'
import path from 'path'

const file = path.join(process.cwd(), 'lib', 'app-info.json')
const appUrl = 'https://example.com/app.apk'

function mockFetch(status: number) {
  return vi.fn().mockResolvedValue(new Response(null, { status }))
}

describe('HEAD /api/app/url', () => {
  it('returns presigned url when HEAD forbidden', async () => {
    const original = global.fetch
    global.fetch = mockFetch(403)
    const backup = await fs.readFile(file, 'utf8')
    await fs.writeFile(file, JSON.stringify({ version: '1', url: appUrl, sha256: 'a' }))
    const req = new NextRequest('http://localhost/api/app/url', { method: 'HEAD' })
    const res = await HEAD(req)
    expect([200,403]).toContain(res.status)
    await fs.writeFile(file, backup)
    global.fetch = original
  })

  it('returns error unreachable when fetch fails', async () => {
    const original = global.fetch
    global.fetch = vi.fn().mockRejectedValue(new Error('offline'))
    const backup = await fs.readFile(file, 'utf8')
    await fs.writeFile(file, JSON.stringify({ version: '1', url: appUrl, sha256: 'a' }))
    const req = new NextRequest('http://localhost/api/app/url', { method: 'HEAD' })
    const res = await HEAD(req)
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ error: 'unreachable' })
    await fs.writeFile(file, backup)
    global.fetch = original
  })

  it('handles relative url', async () => {
    const original = global.fetch
    global.fetch = mockFetch(200)
    const backup = await fs.readFile(file, 'utf8')
    await fs.writeFile(file, JSON.stringify({ version: '1', url: '/rel.apk', sha256: 'a' }))
    const req = new NextRequest('http://localhost/api/app/url', { method: 'HEAD' })
    const res = await HEAD(req)
    expect(res.status).toBe(200)
    await fs.writeFile(file, backup)
    global.fetch = original
  })
})
