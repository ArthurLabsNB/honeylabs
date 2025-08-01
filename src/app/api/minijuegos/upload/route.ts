export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const usuario = await getUsuarioFromSession(req)
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const form = new IncomingForm({ multiples: false })
  const data: any = await new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })

  const { nombre, plataforma } = data.fields
  const file = data.files.archivo
  if (!file || Array.isArray(file)) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  }
  const ext = path.extname(file.originalFilename || '').toLowerCase()
  if (!['.gba', '.nes'].includes(ext)) {
    return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
  }
  const filename = `${Date.now()}_${file.originalFilename}`
  const dest = path.join(process.cwd(), 'public/roms', filename)
  await fs.copyFile(file.filepath, dest)

  await prisma.minijuego.create({
    data: { nombre, plataforma, archivo: filename, usuarioId: usuario.id }
  })

  return NextResponse.json({ ok: true })
}
