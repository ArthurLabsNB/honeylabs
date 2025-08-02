
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@lib/db';
import type { SupabaseClient } from '@supabase/supabase-js'

import crypto from "node:crypto";
import { getUsuarioFromSession } from "@lib/auth";
import { hasManagePerms, normalizeTipoCuenta } from "@lib/permisos";
import * as logger from '@lib/logger'
import { logAudit } from '@/lib/audit'
import { registrarAuditoria } from '@lib/reporter'
import { snapshotAlmacen } from '@/lib/snapshot'

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
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const usuarioIdParam = req.nextUrl.searchParams.get('usuarioId');
    const targetId = usuarioIdParam ? Number(usuarioIdParam) : usuario.id;
    if (usuarioIdParam && targetId !== usuario.id && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const db = getDb().client as SupabaseClient

    const { data: userAlmacenes, error: uaError } = await db
      .from('usuario_almacen')
      .select('almacenId')
      .eq('usuarioId', targetId)
      .order('almacenId', { ascending: true })
      .limit(20)
    if (uaError) throw uaError

    const ids = (userAlmacenes ?? []).map((u) => u.almacenId)
    if (ids.length === 0) {
      return NextResponse.json({ almacenes: [] })
    }

    type ResumenRow = {
      id: number
      nombre: string
      descripcion: string | null
      imagenUrl: string | null
      imagenNombre: string | null
      fechaCreacion: string
      codigoUnico: string
      encargado_nombre: string | null
      encargado_correo: string | null
      ultima_actualizacion: string | null
      notificaciones: number | null
      entradas: number | null
      salidas: number | null
      inventario: number | null
      unidades: number | null
    }

    const { data, error } = await db
      .from<ResumenRow>('almacen_resumen')
      .select(
        'id, nombre, descripcion, imagenUrl, imagenNombre, fechaCreacion, codigoUnico, encargado_nombre, encargado_correo, ultima_actualizacion, notificaciones, entradas, salidas, inventario, unidades'
      )
      .in('id', ids)
      .order('id', { ascending: true })
    if (error) throw error

    let orden: number[] = []
    if (targetId) {
      const { data: prefsUser } = await db
        .from('usuario')
        .select('preferencias')
        .eq('id', targetId)
        .single()
      if (prefsUser?.preferencias) {
        try {
          const p = JSON.parse(prefsUser.preferencias)
          if (Array.isArray(p.ordenAlmacenes)) orden = p.ordenAlmacenes
        } catch {}
      }
    }

    const almacenes = (data ?? []).map((a) => ({
      id: a.id,
      nombre: a.nombre,
      descripcion: a.descripcion,
      imagenUrl: a.imagenNombre ? `/api/almacenes/foto?nombre=${encodeURIComponent(a.imagenNombre)}` : a.imagenUrl,
      codigoUnico: a.codigoUnico,
      fechaCreacion: a.fechaCreacion,
      encargado: a.encargado_nombre,
      correo: a.encargado_correo,
      ultimaActualizacion: a.ultima_actualizacion,
      notificaciones: a.notificaciones ?? 0,
      entradas: a.entradas ?? 0,
      salidas: a.salidas ?? 0,
      inventario: a.inventario ?? 0,
      unidades: a.unidades ?? 0,
    }))

    if (orden.length > 0) {
      const pos = new Map<number, number>()
      orden.forEach((id, i) => pos.set(id, i))
      almacenes.sort((a, b) => {
        const ai = pos.get(a.id) ?? Infinity
        const bi = pos.get(b.id) ?? Infinity
        return ai - bi
      })
    }

    return NextResponse.json({ almacenes })
  } catch (err) {
    logger.error("Error en /api/almacenes:", err);
    return NextResponse.json(
      { error: "Error al obtener almacenes" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const db = getDb()
    const client = db.client as SupabaseClient

    let nombre = '';
    let descripcion = '';
    let funciones = '';
    let permisosPredeterminados = '';
    let imagenNombre: string | null = null;
    let imagenBuffer: Buffer | null = null;
    let imagenUrl: string | null = null;

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData();
      nombre = String(formData.get('nombre') ?? '').trim();
      descripcion = String(formData.get('descripcion') ?? '').trim();
      funciones = String(formData.get('funciones') ?? '').trim();
      permisosPredeterminados = String(formData.get('permisosPredeterminados') ?? '');
      const archivo = formData.get('imagen') as File | null;
      if (archivo) {
        if (!IMAGE_TYPES.includes(archivo.type)) {
          return NextResponse.json({ error: 'Formato de imagen no permitido' }, { status: 415 });
        }
        const buffer = Buffer.from(await archivo.arrayBuffer());
        if (buffer.byteLength > MAX_IMAGE_BYTES) {
          return NextResponse.json({ error: `Imagen demasiado grande. Máx: ${MAX_IMAGE_MB}MB` }, { status: 413 });
        }
        const nombreArchivo = `${crypto.randomUUID()}_${archivo.name}`;
        imagenNombre = nombreArchivo;
        imagenBuffer = buffer;
        imagenUrl = `/api/almacenes/foto?nombre=${encodeURIComponent(nombreArchivo)}`;
      }
    } else {
      const body = await req.json();
      nombre = body.nombre;
      descripcion = body.descripcion;
      funciones = body.funciones;
      permisosPredeterminados = body.permisosPredeterminados;
      imagenUrl = body.imagenUrl;
      imagenNombre = body.imagenNombre ?? null;
    }

    if (!nombre) {
      return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
    }

    if (!usuario.entidadId) {
      const { data: nuevaEntidad, error: entErr } = await client
        .from('entidad')
        .insert({
          nombre: `Entidad de ${usuario.nombre}`,
          tipo: normalizeTipoCuenta(usuario.tipoCuenta),
          correoContacto: usuario.correo ?? '',
        })
        .select('id')
        .single()
      if (entErr) throw entErr
      const { error: updErr } = await client
        .from('usuario')
        // supabase usa snake_case para columnas
        .update({ entidad_id: nuevaEntidad.id })
        .eq('id', usuario.id)
      if (updErr) throw updErr
      usuario.entidadId = nuevaEntidad.id
    }

    const codigoUnico = crypto.randomUUID().split('-')[0];

    const almacen = await db.transaction(async (tx: SupabaseClient) => {
      const { data: creado, error: createErr } = await tx
        .from('almacen')
        .insert({
          nombre,
          descripcion,
          funciones,
          permisosPredeterminados,
          codigoUnico,
          imagenUrl,
          imagenNombre,
          imagen: imagenBuffer,
          entidadId: usuario.entidadId,
        })
        .select('id, nombre, descripcion, imagenNombre, imagenUrl, codigoUnico')
        .single()
      if (createErr) throw createErr
      const { error: uaErr } = await tx
        .from('usuario_almacen')
        .insert({ usuarioId: usuario.id, almacenId: creado.id, rolEnAlmacen: 'propietario' })
      if (uaErr) throw uaErr
      await snapshotAlmacen(tx, creado.id, usuario.id, 'Creación')
      return creado
    })

  await logAudit(usuario.id, 'creacion', 'almacen', { almacenId: almacen.id })

  const { auditoria, error: auditError } = await registrarAuditoria(
    req,
    'almacen',
    almacen.id,
    'creacion',
    { nombre, descripcion, funciones, permisosPredeterminados },
  )

  const resp = {
    ...almacen,
    imagenUrl: imagenNombre
      ? `/api/almacenes/foto?nombre=${encodeURIComponent(imagenNombre)}`
      : almacen.imagenUrl,
  }
  return NextResponse.json({ almacen: resp, auditoria, auditError })
  } catch (err) {
    logger.error('POST /api/almacenes', err);
    return NextResponse.json(
      { error: 'Error al crear almacén' },
      { status: 500 },
    );
  }
}
