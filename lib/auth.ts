import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@lib/prisma'
import { SESSION_COOKIE } from '@lib/constants'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en el entorno')
}

export async function getUsuarioFromSession() {
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
        preferencias: true,
      },
    })
    return usuario
  } catch {
    return null
  }
}
