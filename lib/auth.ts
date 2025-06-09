import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@lib/prisma'
import { SESSION_COOKIE } from '@lib/constants'

const JWT_SECRET = process.env.JWT_SECRET

export async function getUsuarioFromSession() {
  if (!JWT_SECRET) return null

  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        tipoCuenta: true,
        entidadId: true,
        esSuperAdmin: true,
        roles: { select: { nombre: true } },
        plan: { select: { nombre: true } },
        preferencias: true,
      },
    })
    return usuario
  } catch {
    return null
  }
}
