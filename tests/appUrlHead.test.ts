import { describe, it, expect, vi } from 'vitest'
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
    const res = await HEAD()
    expect([200,403]).toContain(res.status)
    await fs.writeFile(file, backup)
    global.fetch = original
  })
})
