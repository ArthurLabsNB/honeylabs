import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import * as auth from '../lib/auth'
import * as mobile from '../lib/mobile'
import { POST } from '../src/app/api/build-mobile/route'

const buildStatusPath = path.join(process.cwd(), 'public', 'build-status.json')
const envBackup = { repo: process.env.GITHUB_REPO, token: process.env.GITHUB_TOKEN }

afterEach(async () => {
  vi.restoreAllMocks()
  process.env.GITHUB_REPO = envBackup.repo
  process.env.GITHUB_TOKEN = envBackup.token
  await fs.writeFile(buildStatusPath, JSON.stringify({ building: false, progress: 0 }))
  await fs.rm(path.join(process.cwd(), '.github', 'workflows', 'build.yml')).catch(() => {})
})

describe('build mobile endpoint', () => {
  it('rejects unauthorized user', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/build-mobile', {
      method: 'POST',
      headers: { 'x-csrf-token': 'secret' },
      body: JSON.stringify({ commit: 'a'.repeat(64) }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('rejects non admin user', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'standard' } as any)
    process.env.CSRF_TOKEN = 'secret'
    const req = new NextRequest('http://localhost/api/build-mobile', { method: 'POST', headers: { 'x-csrf-token': 'secret' } })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('returns 500 when env missing', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    process.env.CSRF_TOKEN = 'secret'
    const req = new NextRequest('http://localhost/api/build-mobile', {
      method: 'POST',
      headers: { 'x-csrf-token': 'secret' },
      body: JSON.stringify({ commit: 'a'.repeat(64) }),
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })

  it('triggers build for admin', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    vi.spyOn(mobile, 'detectNativeChanges').mockResolvedValue(false)
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(new Response('{}'))
    process.env.GITHUB_REPO = 'repo'
    process.env.GITHUB_TOKEN = 'tok'
    await fs.writeFile(path.join(process.cwd(), '.github', 'workflows', 'build.yml'), '')
    process.env.CSRF_TOKEN = 'secret'
    const req = new NextRequest('http://localhost/api/build-mobile', {
      method: 'POST',
      headers: { 'x-csrf-token': 'secret' },
      body: JSON.stringify({ commit: 'a'.repeat(64) }),
    })
    const res = await POST(req)
    expect(res.status).toBe(202)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.ref).toBe('a'.repeat(64))
    expect(body.inputs.event).toBe('ota')
    const data = await res.json()
    expect(data.ok).toBe(true)
  })

  it('keeps building status when dispatch fails', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    vi.spyOn(mobile, 'detectNativeChanges').mockResolvedValue(false)
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('fail'))
    process.env.GITHUB_REPO = 'repo'
    process.env.GITHUB_TOKEN = 'tok'
    process.env.CSRF_TOKEN = 'secret'
    const req = new NextRequest('http://localhost/api/build-mobile', {
      method: 'POST',
      headers: { 'x-csrf-token': 'secret' },
      body: JSON.stringify({ commit: 'a'.repeat(64) }),
    })
    await POST(req)
    const statusRaw = await fs.readFile(buildStatusPath, 'utf8')
    const status = JSON.parse(statusRaw)
    expect(status.progress).toBe(0)
  })

  it('blocks when already building', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    await fs.writeFile(buildStatusPath, JSON.stringify({ building: true, progress: 0 }))
    process.env.CSRF_TOKEN = 'secret'
    const req = new NextRequest('http://localhost/api/build-mobile', {
      method: 'POST',
      headers: { 'x-csrf-token': 'secret' },
      body: JSON.stringify({ commit: 'a'.repeat(64) }),
    })
    const res = await POST(req)
    expect(res.status).toBe(429)
  })
})
