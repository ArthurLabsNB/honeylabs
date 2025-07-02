import { NextResponse } from 'next/server'

export async function GET() {
  const version = '1.0.0'
  const url = '/downloads/honeylabs-1.0.0.apk'
  return NextResponse.json({ version, url })
}
