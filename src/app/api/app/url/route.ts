export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts'
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

export async function HEAD(req: NextRequest) {
  try {
    const raw = await fs.readFile(appInfoPath, 'utf8')
    let { url } = JSON.parse(raw) as { url: string }
    url = new URL(url, req.nextUrl.origin).href
    let res: Response
    try {
      res = await fetch(url, { method: 'HEAD' })
    } catch {
      return NextResponse.json({ error: 'unreachable' }, { status: 502 })
    }
    if (res.ok) return new Response(null)
    if (!res.ok && process.env.AWS_APK_URL) {
      return NextResponse.json({ url: process.env.AWS_APK_URL })
    }
    if (
      res.status === 403 &&
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_REGION &&
      process.env.AWS_ROLE_ARN
    ) {
      const sts = new STSClient({ region: process.env.AWS_REGION })
      const assumed = await sts.send(
        new AssumeRoleCommand({
          RoleArn: process.env.AWS_ROLE_ARN!,
          RoleSessionName: 'honeylabs-presign',
        })
      )
      const creds = assumed.Credentials
      if (creds) {
        const client = new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: creds.AccessKeyId!,
            secretAccessKey: creds.SecretAccessKey!,
            sessionToken: creds.SessionToken,
          },
        })
        const cmd = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: process.env.AWS_S3_KEY || url.split('/').pop()!,
        })
        try {
          const signed = await getSignedUrl(client, cmd, { expiresIn: 300 })
          return NextResponse.json({ url: signed })
        } catch {}
      }
    }
    return new Response(null, { status: res.status })
  } catch {
    if (process.env.AWS_APK_URL) {
      return NextResponse.json({ url: process.env.AWS_APK_URL })
    }
    return new Response(null, { status: 500 })
  }
}
