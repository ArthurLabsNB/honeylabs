import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = 'hl_session' // <--- igual que en el login

export async function getUsuarioFromSession() {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }
    // Busca el usuario real por ID
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
    })
    return usuario
  } catch {
    return null
  }
}
