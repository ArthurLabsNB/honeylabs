import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import * as auth from '../lib/auth'
import { POST } from '../src/app/api/build-mobile/route'

const buildStatusPath = path.join(process.cwd(), 'lib', 'build-status.json')

let statusBackup: string | null = null

beforeEach(async () => {
  try {
    statusBackup = await fs.readFile(buildStatusPath, 'utf8')
  } catch {
    statusBackup = null
  }
})

afterEach(async () => {
  vi.restoreAllMocks()
  if (statusBackup !== null) await fs.writeFile(buildStatusPath, statusBackup)
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
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('run_id')
  })

  it('resets status when dispatch not configured', async () => {
    vi.spyOn(auth, 'getUsuarioFromSession').mockResolvedValue({ tipoCuenta: 'admin' } as any)
    const req = new NextRequest('http://localhost/api/build-mobile', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const status = JSON.parse(await fs.readFile(buildStatusPath, 'utf8'))
    expect(status.building).toBe(false)
    expect(status.progress).toBe(0)
  })
})
