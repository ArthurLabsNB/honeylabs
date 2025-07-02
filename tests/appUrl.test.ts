import { describe, it, expect } from 'vitest'
import { GET } from '../src/app/api/app/url/route'

describe('api app url', () => {
  it('returns url', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('url')
  })
})
