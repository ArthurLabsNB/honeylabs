import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession()
    if (!usuario) return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 })

    const { score } = await req.json()
    if (typeof score !== "number" || score < 0) {
      return NextResponse.json({ ok: false, error: "Puntaje inválido" }, { status: 400 })
    }

    await prisma.puntajePacman.create({
      data: {
        usuarioId: usuario.id,
        puntaje: score,
      }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 })
  }
}
