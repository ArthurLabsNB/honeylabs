import { cookies, type RequestCookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@lib/prisma'
import { SESSION_COOKIE } from '@lib/constants'

const JWT_SECRET = process.env.JWT_SECRET

export async function getUsuarioFromSession(req?: { cookies: RequestCookies }) {
  if (!JWT_SECRET) return null

  const cookieStore = req?.cookies ?? await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; sid?: number }
    if (decoded.sid) {
      const sesion = await prisma.sesionUsuario.findUnique({
        where: { id: decoded.sid },
        select: { activa: true, usuarioId: true },
      })
      if (!sesion || !sesion.activa || sesion.usuarioId !== decoded.id) return null
      await prisma.sesionUsuario.update({
        where: { id: decoded.sid },
        data: { fechaUltima: new Date() },
      })
    }
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
