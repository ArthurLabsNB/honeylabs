export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@lib/db/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { getMainRole, normalizeRol, normalizeTipoCuenta } from '@lib/permisos'
import * as logger from '@lib/logger'

function getUserId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'usuarios')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

function isAdmin(u: any): boolean {
  const _role = getMainRole(u)
  const rol = normalizeRol(
    typeof _role === 'string' ? _role : _role?.nombre,
  )
  const tipo = normalizeTipoCuenta(u?.tipoCuenta)
  return rol === 'admin' || rol === 'administrador' || tipo === 'admin'
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    if (!isAdmin(usuario)) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const id = getUserId(req)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const body = await req.json()
    const data: any = {}
    if (body.correo) data.correo = body.correo
    if (body.contrasena) data.contrasena = await bcrypt.hash(body.contrasena, 10)
    if (body.tipoCuenta) data.tipoCuenta = body.tipoCuenta
    if (body.estado) data.estado = body.estado

    await prisma.usuario.update({ where: { id }, data })
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('PUT /api/admin/usuarios/[id]', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
