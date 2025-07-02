import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import * as auth from '../lib/auth'
import { POST } from '../src/app/api/build-mobile/route'

const buildStatusPath = path.join(process.cwd(), 'lib', 'build-status.json')
const envBackup = { repo: process.env.GITHUB_REPO, token: process.env.GITHUB_TOKEN }

afterEach(() => {
  vi.restoreAllMocks()
  process.env.GITHUB_REPO = envBackup.repo
  process.env.GITHUB_TOKEN = envBackup.token
})

describe('build mobile endpoint', () => {
  it('rejects unauthorized user', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/build-mobile', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('triggers build for admin', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    const req = new NextRequest('http://localhost/api/build-mobile', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(202)
    const data = await res.json()
    expect(data.ok).toBe(true)
  })

  it('keeps building status when dispatch fails', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    process.env.GITHUB_REPO = ''
    process.env.GITHUB_TOKEN = ''
    const req = new NextRequest('http://localhost/api/build-mobile', { method: 'POST' })
    await POST(req)
    const statusRaw = await fs.readFile(buildStatusPath, 'utf8')
    const status = JSON.parse(statusRaw)
    expect(status.building).toBe(true)
  })
})
