export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, sessionCookieOptions } from '@lib/constants'
import { getUsuarioFromSession } from '@lib/auth'
import { prisma } from '@lib/db/prisma'
import * as logger from '@lib/logger'

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession({ cookies: req.cookies })
    if (!usuario) {
      return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 })
    }

    await prisma.sesionUsuario.updateMany({
      where: { usuarioId: usuario.id, activa: true },
      data: { activa: false, fechaUltima: new Date() },
    })

    const res = NextResponse.json({ success: true }, { status: 200 })
    res.cookies.set(SESSION_COOKIE, '', {
      ...sessionCookieOptions,
      expires: new Date(0),
      maxAge: 0,
    })
    return res
  } catch (error) {
    logger.error('[ERROR_LOGOUT_ALL]', error)
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}
