export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getUsuarioFromSession } from "@lib/auth";
import { hasManagePerms } from "@lib/permisos";
import crypto from 'node:crypto';
import * as logger from '@lib/logger'
import { logAudit } from '@/lib/audit'
import { registrarAuditoria } from '@lib/reporter'
import { snapshotAlmacen } from '@/lib/snapshot'

function getAlmacenId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.findIndex((p) => p === 'almacenes');
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null;
  return id && !Number.isNaN(id) ? id : null;
}

const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
];


export async function GET(req: NextRequest) {
  const db = getDb().client as SupabaseClient
  logger.debug(req, 'GET /api/almacenes/[id]')
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    const id = getAlmacenId(req)
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const { data: pertenece, error: perError } = await db
      .from('usuario_almacen')
      .select('id')
      .eq('usuarioId', usuario.id)
      .eq('almacenId', id)
      .maybeSingle()
    if (perError) throw perError
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    const { data: almacen, error: almError } = await db
      .from('almacen')
      .select('id, nombre, descripcion, imagenUrl, imagenNombre')
      .eq('id', id)
      .single()
    if (almError) throw almError
    if (!almacen) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    const { data: enc, error: encError } = await db
      .from('usuario_almacen')
      .select('usuario:usuario(nombre, correo)')
      .eq('almacenId', id)
      .limit(1)
    if (encError) throw encError
    const encargado = enc?.[0]?.usuario

    const { data: movSum, error: movError } = await db
      .from('movimiento')
      .select('tipo, sum:cantidad', { group: 'tipo' })
      .eq('almacenId', id)
    if (movError) throw movError
    let entradas = 0
    let salidas = 0
    for (const r of movSum ?? []) {
      const sum = (r as any).sum ?? (r as any).sum_cantidad ?? 0
      if (r.tipo === 'entrada') entradas = sum
      if (r.tipo === 'salida') salidas = sum
    }

    const { data: movFecha } = await db
      .from('movimiento')
      .select('fecha')
      .eq('almacenId', id)
      .order('fecha', { ascending: false })
      .limit(1)
    const ultima = movFecha?.[0]?.fecha ?? null

    const { count: totalMateriales, error: matCountErr } = await db
      .from('material')
      .select('id', { count: 'exact', head: true })
      .eq('almacenId', id)
    if (matCountErr) throw matCountErr

    const { data: mats, error: matsErr } = await db
      .from('material')
      .select('id,nombre,descripcion,miniaturaNombre,cantidad,unidad,lote,fechaCaducidad,ubicacion,proveedor,estado,observaciones,minimo,maximo,fechaRegistro,fechaActualizacion')
      .eq('almacenId', id)
      .order('id', { ascending: false })
    if (matsErr) throw matsErr

    const res = NextResponse.json({
      almacen: {
        id: almacen.id,
        nombre: almacen.nombre,
        descripcion: almacen.descripcion,
        imagenUrl: almacen.imagenNombre
          ? `/api/almacenes/foto?nombre=${encodeURIComponent(almacen.imagenNombre)}`
          : almacen.imagenUrl,
        encargado: encargado?.nombre ?? null,
        correo: encargado?.correo ?? null,
        ultimaActualizacion: ultima,
        entradas,
        salidas,
        inventario: totalMateriales ?? 0,
        materiales: mats ?? [],
      },
    })
    logger.info(req, `Almacén ${id} consultado`)
    return res
  } catch (err) {
    logger.error('Error en /api/almacenes/[id]', err)
    return NextResponse.json({ error: 'Error al obtener almacén' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const db = getDb()
  const client = db.client as SupabaseClient
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    const id = getAlmacenId(req)
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const { data: pertenece, error: perError } = await client
      .from('usuario_almacen')
      .select('id')
      .eq('usuarioId', usuario.id)
      .eq('almacenId', id)
      .maybeSingle()
    if (perError) throw perError
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    let motivo = ''
    try {
      const body = await req.json()
      motivo = String(body?.motivo ?? '').trim()
    } catch {}

    await db.transaction(async (tx) => {
      await snapshotAlmacen(tx, id, usuario.id, 'Eliminación')
      await tx.from('usuario_almacen').delete().eq('almacenId', id)
      await tx.from('codigo_almacen').delete().eq('almacenId', id)
      await tx.from('movimiento').delete().eq('almacenId', id)
      await tx.from('evento_almacen').delete().eq('almacenId', id)
      await tx.from('novedad_almacen').delete().eq('almacenId', id)
      await tx.from('documento_almacen').delete().eq('almacenId', id)
      await tx.from('incidencia').delete().eq('almacenId', id)
      await tx.from('notificacion').delete().eq('almacenId', id)
      await tx.from('alerta').delete().eq('almacenId', id)
      const { data: mats } = await tx
        .from('material')
        .select('id')
        .eq('almacenId', id)
      const matIds = (mats ?? []).map((m) => m.id)
      if (matIds.length > 0) {
        await tx.from('historial_lote').delete().in('materialId', matIds)
        await tx.from('material_unidad').delete().in('materialId', matIds)
        await tx.from('archivo_material').delete().in('materialId', matIds)
      }
      await tx.from('material').delete().eq('almacenId', id)
      await tx.from('almacen').delete().eq('id', id)
    })

    await logAudit(usuario.id, 'eliminacion', 'almacen', { almacenId: id })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'almacen',
      id,
      'eliminacion',
      { motivo },
    )
    return NextResponse.json({ success: true, auditoria, auditError })
  } catch (err) {
    logger.error('DELETE /api/almacenes/[id]', err)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const db = getDb()
  const client = db.client as SupabaseClient
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    const id = getAlmacenId(req)
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const { data: pertenece, error: perError } = await client
      .from('usuario_almacen')
      .select('id')
      .eq('usuarioId', usuario.id)
      .eq('almacenId', id)
      .maybeSingle()
    if (perError) throw perError
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    let nombre = ''
    let descripcion = ''
    let imagenNombre: string | null = null
    let imagenBuffer: Buffer | null = null
    let imagenUrl: string | undefined = undefined

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData()
      nombre = String(formData.get('nombre') ?? '').trim()
      descripcion = String(formData.get('descripcion') ?? '').trim()
      const archivo = formData.get('imagen') as File | null
      if (archivo) {
        if (!IMAGE_TYPES.includes(archivo.type)) {
          return NextResponse.json({ error: 'Formato de imagen no permitido' }, { status: 415 })
        }
        const buffer = Buffer.from(await archivo.arrayBuffer())
        if (buffer.byteLength > MAX_IMAGE_BYTES) {
          return NextResponse.json({ error: `Imagen demasiado grande. Máx: ${MAX_IMAGE_MB}MB` }, { status: 413 })
        }
        const nombreArchivo = `${crypto.randomUUID()}_${archivo.name}`
        imagenNombre = nombreArchivo
        imagenBuffer = buffer
        imagenUrl = `/api/almacenes/foto?nombre=${encodeURIComponent(nombreArchivo)}`
      }
    } else {
      const body = await req.json()
      nombre = body.nombre
      descripcion = body.descripcion
      imagenUrl = body.imagenUrl
      imagenNombre = body.imagenNombre ?? null
    }

    const almacen = await db.transaction(async (tx) => {
      const { data: upd, error } = await tx
        .from('almacen')
        .update({
          nombre,
          descripcion,
          imagenUrl,
          imagenNombre,
          imagen: imagenBuffer as any,
        })
        .eq('id', id)
        .select('id, nombre, descripcion, imagenNombre, imagenUrl')
        .single()
      if (error) throw error
      await snapshotAlmacen(tx, id, usuario.id, 'Modificación')
      return upd
    })

    await logAudit(usuario.id, 'modificacion', 'almacen', { almacenId: id })

    const { auditoria, error: auditError } = await registrarAuditoria(
      req,
      'almacen',
      id,
      'modificacion',
      { nombre, descripcion, imagenNombre },
    )

    const resp = {
      ...almacen,
      imagenUrl: almacen.imagenNombre
        ? `/api/almacenes/foto?nombre=${encodeURIComponent(almacen.imagenNombre)}`
        : almacen.imagenUrl,
    }
    return NextResponse.json({ almacen: resp, auditoria, auditError })
  } catch (err) {
    logger.error('PUT /api/almacenes/[id]', err)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
