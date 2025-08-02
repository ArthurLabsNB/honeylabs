import { cookies as getCookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SESSION_COOKIE } from '@lib/constants'
import { getDb } from '@lib/db'

const JWT_SECRET = process.env.JWT_SECRET!

function parseJson (v: any) {
  try { return typeof v === 'string' ? JSON.parse(v) : v ?? null }
  catch { return null }
}

export async function getUsuarioFromSession ({ cookies }: { cookies?: ReturnType<typeof getCookies> } = {}) {
  const jar = cookies ?? await getCookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { id, sid } = jwt.verify(token, JWT_SECRET) as { id: number; sid?: number }
    const db = getDb().client as SupabaseClient

    try {
      const { data: ses } = await db.from('sesion_usuario').select('id').eq('id', sid ?? -1).maybeSingle()
      if (!ses) return null
    } catch {}

    const { data: usuario } = await db
      .from('usuario')
      .select(`
        id, nombre, correo, tipo_cuenta, rol, preferencias,
        plan:plan_id ( id, nombre, limites ),
        roles:rol_usuario ( rol:rol_id ( id, nombre, descripcion, permisos ) )
      `)
      .eq('id', id)
      .maybeSingle()

    if (!usuario) return { id }

    const roles = (usuario.roles ?? []).map((r: any) => ({
      id: r.rol.id,
      nombre: r.rol.nombre,
      descripcion: r.rol.descripcion,
      permisos: parseJson(r.rol.permisos),
    }))

    const plan = usuario.plan
      ? { id: usuario.plan.id, nombre: usuario.plan.nombre, limites: parseJson(usuario.plan.limites) }
      : null

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      tipoCuenta: usuario.tipo_cuenta,
      rol: usuario.rol ?? undefined,
      preferencias: parseJson(usuario.preferencias),
      roles,
      plan,
    }
  } catch {
    return null
  }
}
