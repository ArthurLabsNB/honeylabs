import { describe, it, expect } from 'vitest'
import { GET } from '../src/app/api/app/route'

describe('api app info', () => {
  it('returns app info json', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('version')
    expect(data).toHaveProperty('url')
    expect(data).toHaveProperty('sha256')
  })
})
