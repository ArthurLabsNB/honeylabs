export const runtime = 'nodejs'
import { NextResponse } from 'next/server'

export async function GET() {
  const slides = [
    { id: '1', contenido: 'Bienvenido a la presentación.' },
    { id: '2', contenido: 'Aquí puedes mostrar cada sección paso a paso.' },
    { id: '3', contenido: 'Fin del recorrido.' }
  ]
  return NextResponse.json({ slides })
}
