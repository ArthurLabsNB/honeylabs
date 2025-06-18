export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { getUsuarioFromSession } from '@lib/auth'
import { getMainRole, normalizeTipoCuenta } from '@lib/permisos'
import { readWidgetsFile, saveWidgetsFile, WidgetMeta } from '@lib/widgets'
import * as logger from '@lib/logger'

function isAdmin(u: any): boolean {
  const rol = getMainRole(u)?.toLowerCase()
  const tipo = normalizeTipoCuenta(u?.tipoCuenta)
  return rol === 'admin' || rol === 'administrador' || tipo === 'admin'
}

export async function GET() {
  try {
    const widgets = readWidgetsFile()
    return NextResponse.json({ widgets })
  } catch (err) {
    logger.error('GET /api/admin/widgets', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    if (!isAdmin(usuario)) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { key, plans, tipos } = await req.json()
    if (!key) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

    const widgets = readWidgetsFile()
    const idx = widgets.findIndex(w => w.key === key)
    if (idx === -1) return NextResponse.json({ error: 'Widget no encontrado' }, { status: 404 })
    if (plans && Array.isArray(plans)) widgets[idx].plans = plans
    if (tipos && Array.isArray(tipos)) widgets[idx].tipos = tipos
    await saveWidgetsFile(widgets)

    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('PUT /api/admin/widgets', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
