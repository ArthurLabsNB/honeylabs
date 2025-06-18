import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  const summary = `Resumen generado para: ${prompt?.slice(0, 50)}`
  return NextResponse.json({ summary })
}
