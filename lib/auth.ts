import { cookies as getCookies, type RequestCookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getDb } from '@lib/db'
import { SESSION_COOKIE } from '@lib/constants'
import type { Usuario } from '@/types/usuario'
import type { SupabaseClient } from '@supabase/supabase-js'

interface SesionUsuario {
  activa: boolean
  usuarioId: number
}

interface AuthDb {
  sesionUsuario: {
    findUnique(args: {
      where: { id: number }
      select: { activa: true; usuarioId: true }
    }): Promise<SesionUsuario | null>
    update(args: {
      where: { id: number }
      data: { fechaUltima: Date }
    }): Promise<void>
  }
  usuario: {
    findUnique(args: {
      where: { id: number }
      select: {
        id: true
        nombre: true
        correo: true
        tipoCuenta: true
        entidadId: true
        esSuperAdmin: true
        roles: { select: { nombre: true } }
        plan: { select: { nombre: true } }
        preferencias: true
      }
    }): Promise<Usuario | null>
  }
}

const JWT_SECRET = process.env.JWT_SECRET!

export async function getUsuarioFromSession(
  { cookies }: { cookies?: RequestCookies } = {},
): Promise<Usuario | null> {
  const jar = cookies ?? getCookies()
  const token = jar.get(SESSION_COOKIE)?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; sid?: number }

    if (process.env.DB_PROVIDER === 'prisma') {
      const db = getDb().client as AuthDb
      if (decoded.sid) {
        const sesion = await db.sesionUsuario.findUnique({
          where: { id: decoded.sid },
          select: { activa: true, usuarioId: true },
        })
        if (!sesion || !sesion.activa || sesion.usuarioId !== decoded.id) return null
        await db.sesionUsuario.update({
          where: { id: decoded.sid },
          data: { fechaUltima: new Date() },
        })
      }
      const usuario = await db.usuario.findUnique({
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
    }

    const db = getDb().client as SupabaseClient
    if (decoded.sid) {
      const { data: sesion } = await db
        .from('sesion_usuario')
        .select('activa,usuarioId')
        .eq('id', decoded.sid)
        .maybeSingle()
      if (!sesion || !sesion.activa || sesion.usuarioId !== decoded.id) return null
      await db
        .from('sesion_usuario')
        .update({ fechaUltima: new Date().toISOString() })
        .eq('id', decoded.sid)
    }
    const { data: usuario } = await db
      .from('usuario')
      .select(
        'id,nombre,correo,tipoCuenta,entidadId,esSuperAdmin,' +
          'roles:rol(nombre,_RolToUsuario!inner(usuarioId)),plan:plan_id(nombre),preferencias',
      )
      .eq('id', decoded.id)
      .maybeSingle()
    return usuario as unknown as Usuario | null
  } catch {
    return null
  }
}
