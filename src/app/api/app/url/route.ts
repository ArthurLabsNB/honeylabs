export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const appInfoPath = path.join(process.cwd(), 'lib', 'app-info.json')

export async function GET() {
  try {
    const raw = await fs.readFile(appInfoPath, 'utf8')
    const { url } = JSON.parse(raw) as { url: string }
    if (!url) throw new Error('invalid')
    return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'info_unavailable' }, { status: 500 })
  }
}

export async function HEAD() {
  try {
    const raw = await fs.readFile(appInfoPath, 'utf8')
    const { url } = JSON.parse(raw) as { url: string }
    const res = await fetch(url, { method: 'HEAD' })
    if (res.ok) return new Response(null)
    if (res.status === 403 && process.env.AWS_S3_BUCKET && process.env.AWS_REGION) {
      const client = new S3Client({ region: process.env.AWS_REGION })
      const cmd = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: process.env.AWS_S3_KEY || url.split('/').pop()! })
      try {
        const signed = await getSignedUrl(client, cmd, { expiresIn: 900 })
        return NextResponse.json({ url: signed })
      } catch {}
    }
    return new Response(null, { status: res.status })
  } catch {
    return new Response(null, { status: 500 })
  }
}
