export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import { materialSchema } from '@/lib/validators/material'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import crypto from 'node:crypto'
import * as logger from '@lib/logger'
import { logAudit } from '@/lib/audit'
import { registrarAuditoria } from '@lib/reporter'
import { snapshotMaterial } from '@/lib/snapshot'
import { emitEvent } from '@/lib/events'

function getAlmacenIdFromRequest(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex((p) => p === 'almacenes')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  const db = getDb().client as SupabaseClient
  logger.debug(req, 'GET /api/almacenes/[id]/materiales')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const almacenId = getAlmacenIdFromRequest(req)
    if (!almacenId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const { data: pertenece, error: perError } = await db
      .from('usuario_almacen')
      .select('id')
      .eq('usuario_id', usuario.id)
      .eq('almacen_id', almacenId)
      .maybeSingle()
    if (perError) throw perError
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const cols =
      'id,nombre,descripcion,cantidad,unidad,lote,fechaCaducidad,ubicacion,proveedor,estado,observaciones,codigoBarra,codigoQR,minimo,maximo,fecha_registro,fechaActualizacion, unidades:material_unidad(id)'
    const camel = `miniaturaNombre,${cols}`
    const snake = `miniatura_nombre:miniaturaNombre,${cols}`
    let { data: rows, error } = await db
      .from('material')
      .select(camel)
      .eq('almacenId', almacenId)
      .order('id', { ascending: false })
    if (error) {
      const fb = await db
        .from('material')
        .select(snake)
        .eq('almacen_id', almacenId)
        .order('id', { ascending: false })
      rows = fb.data
      error = fb.error
    }
    if (error) throw error
    const materiales = (rows ?? []).map((m) => ({
      id: m.id,
      nombre: m.nombre,
      descripcion: m.descripcion,
      miniaturaNombre: m.miniaturaNombre ?? null,
      cantidad: m.cantidad,
      unidad: m.unidad,
      lote: m.lote,
      fechaCaducidad: m.fechaCaducidad,
      ubicacion: m.ubicacion,
      proveedor: m.proveedor,
      estado: m.estado,
      observaciones: m.observaciones,
      codigoBarra: m.codigoBarra,
      codigoQR: m.codigoQR,
      minimo: m.minimo,
      maximo: m.maximo,
      fechaRegistro: (m as any).fecha_registro,
      fechaActualizacion: m.fechaActualizacion,
      _count: { unidades: (m as any).unidades?.length ?? 0 },
    }))

    const res = NextResponse.json({ materiales })
    logger.info(req, `Listados ${materiales.length} materiales`)
    return res
  } catch (err) {
    logger.error('GET /api/almacenes/[id]/materiales', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const db = getDb()
  const client = db.client as SupabaseClient
  logger.debug(req, 'POST /api/almacenes/[id]/materiales')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const almacenId = getAlmacenIdFromRequest(req)
    if (!almacenId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const { data: pertenece, error: perError } = await client
      .from('usuario_almacen')
      .select('id')
      .eq('usuario_id', usuario.id)
      .eq('almacen_id', almacenId)
      .maybeSingle()
    if (perError) throw perError
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    let miniaturaNombre: string | null = null
    let miniaturaBuffer: Buffer | null = null
    let datos: any = {}
    let reportFiles: File[] = []

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData()
      datos = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion') ?? undefined,
        cantidad: formData.get('cantidad'),
        unidad: formData.get('unidad'),
        lote: formData.get('lote'),
        fechaCaducidad: formData.get('fechaCaducidad'),
        ubicacion: formData.get('ubicacion'),
        proveedor: formData.get('proveedor'),
        estado: formData.get('estado'),
        observaciones: formData.get('observaciones'),
        minimo: formData.get('minimo'),
        maximo: formData.get('maximo'),
        codigoBarra: formData.get('codigoBarra'),
        codigoQR: formData.get('codigoQR'),
        reorderLevel: formData.get('reorderLevel'),
        miniaturaNombre: undefined,
      }
      reportFiles = formData.getAll('archivos') as File[]
      const archivo = formData.get('miniatura') as File | null
      if (archivo) {
        const buffer = Buffer.from(await archivo.arrayBuffer())
        const nombreArchivo = `${crypto.randomUUID()}_${archivo.name}`
        miniaturaNombre = nombreArchivo
        miniaturaBuffer = buffer
        datos.miniaturaNombre = nombreArchivo
        reportFiles.push(archivo)
      }
    } else {
      datos = await req.json()
    }

    const parsed = materialSchema.partial().safeParse(datos)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      const campo = issue?.path?.[0]
      const msg = campo ? `Campo "${campo}" inválido` : 'Datos inválidos'
      return NextResponse.json({ error: msg }, { status: 400 })
    }
    const {
      nombre,
      descripcion,
      cantidad,
      unidad,
      lote,
      fechaCaducidad,
      ubicacion,
      proveedor,
      estado,
      observaciones,
      minimo,
      maximo,
      codigoBarra,
      codigoQR,
      reorderLevel,
    } = parsed.data

    if (
      nombre !== undefined &&
      (!nombre.trim() || nombre.trim().toLowerCase() === 'nuevo')
    ) {
      return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 })
    }

    miniaturaNombre = parsed.data.miniaturaNombre ?? miniaturaNombre

    const material = await db.transaction(async (tx) => {
      const { data: creado, error } = await tx
        .from('material')
        .insert({
          nombre: nombre ?? '',
          descripcion,
          miniatura: miniaturaBuffer as any,
          miniaturaNombre,
          cantidad: cantidad ?? 0,
          unidad,
          lote,
          fechaCaducidad,
          ubicacion,
          proveedor,
          estado,
          observaciones,
          codigoBarra,
          codigoQR,
          minimo,
          maximo,
          reorderLevel,
          almacenId,
          usuarioId: usuario.id,
        })
        .select('id, nombre, miniaturaNombre')
        .single()
      if (error) throw error
      await tx
        .from('usuario_almacen')
        .upsert(
          { usuario_id: usuario.id, almacen_id: almacenId, rolEnAlmacen: 'creador' },
          { onConflict: 'usuario_id,almacen_id' },
        )
      await snapshotMaterial(tx, creado.id, usuario.id, 'Creación')
      return creado
    })

    await logAudit(usuario.id, 'creacion_material', 'almacen', {
      almacenId,
      materialId: material.id,
    })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'material',
      material.id,
      'creacion',
      parsed.data,
      reportFiles,
    )

    const res = NextResponse.json({ material, auditoria, auditError })
    logger.info(req, `Material ${material.id} creado`)
    return res
  } catch (err) {
    logger.error('POST /api/almacenes/[id]/materiales', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const db = getDb().client as SupabaseClient
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const almacenId = getAlmacenIdFromRequest(req)
    if (!almacenId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const { data: pertenece, error: perError } = await db
      .from('usuario_almacen')
      .select('id')
      .eq('usuario_id', usuario.id)
      .eq('almacen_id', almacenId)
      .maybeSingle()
    if (perError) throw perError
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const { data: mats } = await db
      .from('material')
      .select('id')
      .eq('almacenId', almacenId)
    const matIds = (mats ?? []).map((m) => m.id)
    if (matIds.length > 0) {
      await db.from('historial_lote').delete().in('materialId', matIds)
      await db.from('material_unidad').delete().in('materialId', matIds)
      await db.from('archivo_material').delete().in('materialId', matIds)
    }
    await db.from('material').delete().eq('almacenId', almacenId)
    await logAudit(usuario.id, 'eliminacion_materiales', 'almacen', { almacenId })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'almacen',
      almacenId,
      'eliminacion',
      { accion: 'vaciar_materiales' },
    )

    await db.from('alerta').insert({
      titulo: 'Eliminación masiva de materiales',
      mensaje: 'Se eliminaron todos los materiales del almacén',
      prioridad: 'ALTA',
      tipo: 'eliminacion_masiva',
      almacenId,
    })
    emitEvent({ type: 'alertas_update', payload: { almacenId } })

    return NextResponse.json({ success: true, auditoria, auditError })
  } catch (err) {
    logger.error('DELETE /api/almacenes/[id]/materiales', err)
    return NextResponse.json({ error: 'Error al vaciar' }, { status: 500 })
  }
}

