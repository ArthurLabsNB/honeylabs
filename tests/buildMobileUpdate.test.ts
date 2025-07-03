import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { POST } from '../src/app/api/build-mobile/update/route'

const appInfoPath = path.join(process.cwd(), 'lib', 'app-info.json')
const buildStatusPath = path.join(process.cwd(), 'public', 'build-status.json')

let infoBackup: string | null = null
let statusBackup: string | null = null

beforeEach(async () => {
  try {
    infoBackup = await fs.readFile(appInfoPath, 'utf8')
  } catch {
    infoBackup = null
  }
  try {
    statusBackup = await fs.readFile(buildStatusPath, 'utf8')
  } catch {
    statusBackup = null
  }
})

afterEach(async () => {
  if (infoBackup !== null) await fs.writeFile(appInfoPath, infoBackup)
  if (statusBackup !== null) await fs.writeFile(buildStatusPath, statusBackup)
})

describe('build mobile update endpoint', () => {
  it('rejects invalid token', async () => {
    process.env.BUILD_TOKEN = 'secret'
    const req = new NextRequest('http://localhost/api/build-mobile/update', {
      method: 'POST',
      body: JSON.stringify({ version: '1', url: 'u', sha256: 's' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('updates build info', async () => {
    process.env.BUILD_TOKEN = 'secret'
    const req = new NextRequest('http://localhost/api/build-mobile/update', {
      method: 'POST',
      body: JSON.stringify({ token: 'secret', version: '1', url: '/a.apk', sha256: 'abc' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const info = JSON.parse(await fs.readFile(appInfoPath, 'utf8'))
    expect(info.version).toBe('1')
    const status = JSON.parse(await fs.readFile(buildStatusPath, 'utf8'))
    expect(status.building).toBe(false)
    expect(status.progress).toBe(1)
  })
})
