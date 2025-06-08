import { NextResponse } from 'next/server'

export async function jsonOrNull(res: Response) {
  const type = res.headers.get('content-type') ?? ''
  if (type.includes('application/json')) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }
  return null
}

export function respuestaError(error: string, detalle: string, status = 400) {
  return NextResponse.json({ error, detalle }, { status })
}
