export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@lib/db';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getUsuarioFromSession } from '@lib/auth';
import { hasManagePerms } from '@lib/permisos';
import crypto from 'node:crypto';
import * as logger from '@lib/logger';
import { logAudit } from '@/lib/audit';
import { registrarAuditoria } from '@lib/reporter';
import { snapshotAlmacen } from '@/lib/snapshot';

/* ───────── utils ───────── */
function getAlmacenId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/');
  const idx = parts.findIndex((p) => p === 'almacenes');
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null;
  return id && !Number.isNaN(id) ? id : null;
}

function safeMsg(err: unknown, fallback = 'Error'): string {
  const e = err as any;
  return e?.message ? String(e.message) : fallback;
}

/* Imagen */
const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

/* Helpers Supabase con fallback camel/snake */
async function findMembership(
  db: SupabaseClient,
  usuarioId: number,
  almacenId: number,
): Promise<boolean> {
  // snake_case primero
  const q1 = await db
    .from('usuario_almacen')
    .select('id', { count: 'exact', head: true })
    .eq('usuario_id', usuarioId)
    .eq('almacen_id', almacenId);
  if (!q1.error && (q1.count ?? 0) > 0) return true;

  // fallback camelCase
  const q2 = await db
    .from('usuario_almacen')
    .select('id', { count: 'exact', head: true })
    .eq('usuarioId', usuarioId)
    .eq('almacenId', almacenId);
  if (!q2.error && (q2.count ?? 0) > 0) return true;

  return false;
}

async function selectAlmacen(db: SupabaseClient, id: number) {
  // Selecciona todo para mapear nombres camel/snake
  const { data, error } = await db.from('almacen').select('*').eq('id', id).single();
  if (error) throw error;
  return data as any;
}

async function firstEncargado(db: SupabaseClient, almacenId: number) {
  // primer usuario asociado
  const cam = await db
    .from('usuario_almacen')
    .select('usuario:usuario(nombre, correo)')
    .eq('almacenId', almacenId)
    .limit(1);
  if (!cam.error && cam.data?.length) return cam.data[0]?.usuario ?? null;

  const sn = await db
    .from('usuario_almacen')
    .select('usuario:usuario(nombre, correo)')
    .eq('almacen_id', almacenId)
    .limit(1);
  if (!sn.error && sn.data?.length) return sn.data[0]?.usuario ?? null;

  return null;
}

async function sumMovimientos(db: SupabaseClient, almacenId: number) {
  const try1 = await db
    .from('movimiento')
    .select('tipo, sum:cantidad', { group: 'tipo' })
    .eq('almacenId', almacenId);
  if (!try1.error) return try1.data ?? [];

  const try2 = await db
    .from('movimiento')
    .select('tipo, sum:cantidad', { group: 'tipo' })
    .eq('almacen_id', almacenId);
  if (!try2.error) return try2.data ?? [];

  throw try1.error ?? try2.error;
}

async function lastMovimientoFecha(db: SupabaseClient, almacenId: number): Promise<string | null> {
  const t1 = await db
    .from('movimiento')
    .select('fecha')
    .eq('almacenId', almacenId)
    .order('fecha', { ascending: false })
    .limit(1);
  if (!t1.error) return t1.data?.[0]?.fecha ?? null;

  const t2 = await db
    .from('movimiento')
    .select('fecha')
    .eq('almacen_id', almacenId)
    .order('fecha', { ascending: false })
    .limit(1);
  if (!t2.error) return t2.data?.[0]?.fecha ?? null;

  return null;
}

async function countMateriales(db: SupabaseClient, almacenId: number): Promise<number> {
  const c1 = await db
    .from('material')
    .select('id', { count: 'exact', head: true })
    .eq('almacenId', almacenId);
  if (!c1.error) return c1.count ?? 0;

  const c2 = await db
    .from('material')
    .select('id', { count: 'exact', head: true })
    .eq('almacen_id', almacenId);
  if (!c2.error) return c2.count ?? 0;

  return 0;
}

async function listMateriales(db: SupabaseClient, almacenId: number) {
  const cols =
    'id,nombre,descripcion,miniaturaNombre,cantidad,unidad,lote,fechaCaducidad,ubicacion,proveedor,estado,observaciones,minimo,maximo,fecha_registro,fechaActualizacion';
  const q1 = await db.from('material').select(cols).eq('almacenId', almacenId).order('id', { ascending: false });
  if (!q1.error)
    return (q1.data ?? []).map((m: any) => {
      const { fecha_registro, ...rest } = m;
      return { ...rest, fechaRegistro: fecha_registro };
    });

  const q2 = await db.from('material').select(cols).eq('almacen_id', almacenId).order('id', { ascending: false });
  if (!q2.error)
    return (q2.data ?? []).map((m: any) => {
      const { fecha_registro, ...rest } = m;
      return { ...rest, fechaRegistro: fecha_registro };
    });

  throw q1.error ?? q2.error;
}

/* ───────── GET /api/almacenes/[id] ───────── */
export async function GET(req: NextRequest) {
  const db = getDb().client as SupabaseClient;
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const id = getAlmacenId(req);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const pertenece = await findMembership(db, usuario.id, id);
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const raw = await selectAlmacen(db, id);
    if (!raw) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    const encargado = await firstEncargado(db, id);

    // sumas de movimientos
    const movSum = await sumMovimientos(db, id);
    let entradas = 0;
    let salidas = 0;
    for (const r of movSum) {
      const sum = (r as any).sum ?? (r as any).sum_cantidad ?? 0;
      if ((r as any).tipo === 'entrada') entradas = sum ?? 0;
      if ((r as any).tipo === 'salida') salidas = sum ?? 0;
    }

    const ultima = await lastMovimientoFecha(db, id);
    const totalMateriales = await countMateriales(db, id);
    const mats = await listMateriales(db, id);

    const imagenNombre = raw.imagenNombre ?? raw.imagen_nombre ?? null;
    const imagenUrl = raw.imagenUrl ?? raw.imagen_url ?? null;

    const res = NextResponse.json({
      almacen: {
        id: raw.id,
        nombre: raw.nombre,
        descripcion: raw.descripcion ?? null,
        imagenUrl: imagenNombre
          ? `/api/almacenes/foto?nombre=${encodeURIComponent(imagenNombre)}`
          : imagenUrl,
        encargado: encargado?.nombre ?? null,
        correo: encargado?.correo ?? null,
        ultimaActualizacion: ultima,
        entradas,
        salidas,
        inventario: totalMateriales ?? 0,
        materiales: mats ?? [],
      },
    });
    return res;
  } catch (err) {
    logger.error('GET /api/almacenes/[id]', err);
    return NextResponse.json({ error: safeMsg(err, 'Error al obtener almacén') }, { status: 500 });
  }
}

/* ───────── DELETE /api/almacenes/[id] ───────── */
export async function DELETE(req: NextRequest) {
  const db = getDb();
  const client = db.client as SupabaseClient;
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const id = getAlmacenId(req);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const pertenece = await findMembership(client, usuario.id, id);
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    let motivo = '';
    try {
      const body = await req.json();
      motivo = String(body?.motivo ?? '').trim();
    } catch {}

    await db.transaction(async (tx) => {
      // snapshot previo
      await snapshotAlmacen(tx, id, usuario.id, 'Eliminación');

      // relaciones dependientes (camel y snake)
      await tx.from('usuario_almacen').delete().eq('almacenId', id);
      await tx.from('usuario_almacen').delete().eq('almacen_id', id);

      await tx.from('codigo_almacen').delete().eq('almacenId', id);
      await tx.from('codigo_almacen').delete().eq('almacen_id', id);

      await tx.from('movimiento').delete().eq('almacenId', id);
      await tx.from('movimiento').delete().eq('almacen_id', id);

      await tx.from('evento_almacen').delete().eq('almacenId', id);
      await tx.from('evento_almacen').delete().eq('almacen_id', id);

      await tx.from('novedad_almacen').delete().eq('almacenId', id);
      await tx.from('novedad_almacen').delete().eq('almacen_id', id);

      await tx.from('documento_almacen').delete().eq('almacenId', id);
      await tx.from('documento_almacen').delete().eq('almacen_id', id);

      await tx.from('incidencia').delete().eq('almacenId', id);
      await tx.from('incidencia').delete().eq('almacen_id', id);

      await tx.from('notificacion').delete().eq('almacenId', id);
      await tx.from('notificacion').delete().eq('almacen_id', id);

      await tx.from('alerta').delete().eq('almacenId', id);
      await tx.from('alerta').delete().eq('almacen_id', id);

      // materiales y dependencias
      const { data: mats1 } = await tx.from('material').select('id').eq('almacenId', id);
      const { data: mats2 } = await tx.from('material').select('id').eq('almacen_id', id);
      const matIds = [...(mats1 ?? []), ...(mats2 ?? [])].map((m: any) => m.id);
      if (matIds.length > 0) {
        await tx.from('historial_lote').delete().in('materialId', matIds);
        await tx.from('historial_lote').delete().in('material_id', matIds);

        await tx.from('material_unidad').delete().in('materialId', matIds);
        await tx.from('material_unidad').delete().in('material_id', matIds);

        await tx.from('archivo_material').delete().in('materialId', matIds);
        await tx.from('archivo_material').delete().in('material_id', matIds);
      }

      await tx.from('material').delete().eq('almacenId', id);
      await tx.from('material').delete().eq('almacen_id', id);

      await tx.from('almacen').delete().eq('id', id);
    });

    await logAudit(usuario.id, 'eliminacion', 'almacen', { almacenId: id });
    const { auditoria, error: auditError } = await registrarAuditoria(req, 'almacen', id, 'eliminacion', { motivo });
    return NextResponse.json({ success: true, auditoria, auditError });
  } catch (err) {
    logger.error('DELETE /api/almacenes/[id]', err);
    return NextResponse.json({ error: safeMsg(err, 'Error al eliminar') }, { status: 500 });
  }
}

/* ───────── PUT /api/almacenes/[id] ───────── */
export async function PUT(req: NextRequest) {
  const db = getDb();
  const client = db.client as SupabaseClient;
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const id = getAlmacenId(req);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const pertenece = await findMembership(client, usuario.id, id);
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    let nombre = '';
    let descripcion = '';
    let imagenNombre: string | null = null;
    let imagenBuffer: Buffer | null = null;
    let imagenUrl: string | undefined = undefined;

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData();
      nombre = String(formData.get('nombre') ?? '').trim();
      descripcion = String(formData.get('descripcion') ?? '').trim();
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
      const body = await req.json().catch(() => ({}));
      nombre = (body?.nombre ?? '').toString().trim();
      descripcion = (body?.descripcion ?? '').toString();
      imagenUrl = body?.imagenUrl ?? undefined;
      imagenNombre = body?.imagenNombre ?? null;
    }

    const almacen = await db.transaction(async (tx) => {
      // Intento camel
      const upd1 = await tx
        .from('almacen')
        .update({
          nombre,
          descripcion,
          imagenUrl: imagenUrl as any,
          imagenNombre,
          imagen: imagenBuffer as any,
        })
        .eq('id', id)
        .select('id, nombre, descripcion, imagenNombre, imagenUrl')
        .single();

      if (!upd1.error) {
        await snapshotAlmacen(tx, id, usuario.id, 'Modificación');
        return upd1.data!;
      }

      // Intento snake
      const upd2 = await tx
        .from('almacen')
        .update({
          nombre,
          descripcion,
          imagen_url: (imagenUrl as any) ?? null,
          imagen_nombre: imagenNombre,
          imagen: imagenBuffer as any,
        } as any)
        .eq('id', id)
        .select('id, nombre, descripcion, imagenNombre, imagenUrl, imagen_nombre, imagen_url')
        .single();

      if (upd2.error) throw upd2.error;

      await snapshotAlmacen(tx, id, usuario.id, 'Modificación');
      return upd2.data!;
    });

    await logAudit(usuario.id, 'modificacion', 'almacen', { almacenId: id });
    const { auditoria, error: auditError } = await registrarAuditoria(req, 'almacen', id, 'modificacion', {
      nombre,
      descripcion,
      imagenNombre,
    });

    const iNombre = (almacen as any).imagenNombre ?? (almacen as any).imagen_nombre ?? null;
    const iUrl = (almacen as any).imagenUrl ?? (almacen as any).imagen_url ?? null;

    const resp = {
      id: (almacen as any).id,
      nombre: (almacen as any).nombre,
      descripcion: (almacen as any).descripcion ?? null,
      imagenNombre: iNombre,
      imagenUrl: iNombre ? `/api/almacenes/foto?nombre=${encodeURIComponent(iNombre)}` : iUrl,
    };
    return NextResponse.json({ almacen: resp, auditoria, auditError });
  } catch (err) {
    logger.error('PUT /api/almacenes/[id]', err);
    return NextResponse.json({ error: safeMsg(err, 'Error al actualizar') }, { status: 500 });
  }
}
