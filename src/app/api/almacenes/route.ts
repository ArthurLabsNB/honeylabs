export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@lib/db';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getUsuarioFromSession } from '@lib/auth';
import { hasManagePerms, normalizeTipoCuenta } from '@lib/permisos';
import * as logger from '@lib/logger';
import crypto from 'node:crypto';
import { logAudit } from '@/lib/audit';
import { registrarAuditoria } from '@lib/reporter';
import { snapshotAlmacen } from '@/lib/snapshot';

/* ---------- IMAGEN ---------- */
const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
const toByteaHex = (buf: Buffer | null) => (buf ? '\\x' + buf.toString('hex') : null);

/* ---------- HELPERS ---------- */
const msg = (e: any, d = 'Error') => String(e?.message || e?.hint || e?.details || e?.code || d);

async function tryInsert<T = any>(
  db: SupabaseClient,
  table: string,
  payloads: Array<Record<string, any>>,
  select = '*',
): Promise<T> {
  let last: any = null;
  for (const body of payloads) {
    const { data, error } = await db.from(table).insert(body).select(select).single();
    if (error)
      logger.error(`[ALM_CREATE] insert ${table}`, {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
      });
    if (!error && data) return data as T;
    last = error;
    // si es columna o tabla inexistente, probamos siguiente variante
    if (['PGRST204', '42P01', '42703'].includes(error?.code)) continue;
    break; // otros errores: salir
  }
  throw last ?? new Error('insert failed');
}

async function tryUpdate(
  db: SupabaseClient,
  table: string,
  payloads: Array<Record<string, any>>,
  match: Record<string, any>,
) {
  let last: any = null;
  for (const body of payloads) {
    const q = db.from(table).update(body);
    Object.entries(match).forEach(([k, v]) => (q as any).eq(k, v));
    const { error } = await q;
    if (error)
      logger.error(`[ALM_UPDATE] update ${table}`, {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
      });
    if (!error) return;
    last = error;
    if (['PGRST204', '42P01', '42703'].includes(error?.code)) continue;
    break;
  }
  throw last ?? new Error('update failed');
}

/* ---------- GET (lista) ---------- */
export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const db = getDb().client as SupabaseClient;

    const usuarioIdParam = req.nextUrl.searchParams.get('usuarioId');
    const targetId = usuarioIdParam ? Number(usuarioIdParam) : usuario.id;
    if (usuarioIdParam && targetId !== usuario.id && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const { data: userAlmacenes, error: uaError } = await db
      .from('usuario_almacen')
      .select('almacenId')
      .eq('usuarioId', targetId)
      .order('almacenId', { ascending: true })
      .limit(20);
    if (uaError) throw uaError;

    const ids = (userAlmacenes ?? []).map((u) => u.almacenId);
    if (ids.length === 0) return NextResponse.json({ almacenes: [] });

    type Row = {
      id: number; nombre: string; descripcion: string | null;
      imagenUrl: string | null; imagenNombre: string | null;
      fechaCreacion: string; codigoUnico: string;
      encargado_nombre: string | null; encargado_correo: string | null;
      ultima_actualizacion: string | null; notificaciones: number | null;
      entradas: number | null; salidas: number | null; inventario: number | null; unidades: number | null;
    };

    const { data, error } = await db
      .from<Row>('almacen_resumen')
      .select('id,nombre,descripcion,imagenUrl,imagenNombre,fechaCreacion,codigoUnico,encargado_nombre,encargado_correo,ultima_actualizacion,notificaciones,entradas,salidas,inventario,unidades')
      .in('id', ids)
      .order('id', { ascending: true });
    if (error) throw error;

    // orden favorito del usuario
    let orden: number[] = [];
    const { data: prefs } = await db.from('usuario').select('preferencias').eq('id', targetId).single();
    if (prefs?.preferencias) {
      try {
        const p = JSON.parse(prefs.preferencias);
        if (Array.isArray(p.ordenAlmacenes)) orden = p.ordenAlmacenes;
      } catch {}
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
    }));

    if (orden.length) {
      const pos = new Map<number, number>();
      orden.forEach((id, i) => pos.set(id, i));
      almacenes.sort((a, b) => (pos.get(a.id) ?? Infinity) - (pos.get(b.id) ?? Infinity));
    }

    return NextResponse.json({ almacenes });
  } catch (err) {
    logger.error('GET /api/almacenes', err);
    return NextResponse.json({ error: msg(err, 'Error al obtener almacenes') }, { status: 500 });
  }
}

/* ---------- POST (crear) ---------- */
export async function POST(req: NextRequest) {
  const db = getDb().client as SupabaseClient;

  try {
    logger.info('[ALM_CREATE] hit', { ct: req.headers.get('content-type') });
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    if (!hasManagePerms(usuario)) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    logger.info('[ALM_CREATE] user', { id: usuario?.id, entidadId: usuario?.entidadId });

    // parse body
    let nombre = '';
    let descripcion = '';
    let funciones = '';
    let permisosPredeterminados = '';
    let imagenNombre: string | null = null;
    let imagenUrl: string | null = null;
    let imagenBuf: Buffer | null = null;

    const ct = req.headers.get('content-type') || '';
    if (ct.includes('multipart/form-data')) {
      const fd = await req.formData();
      nombre = String(fd.get('nombre') ?? '').trim();
      descripcion = String(fd.get('descripcion') ?? '').trim();
      funciones = String(fd.get('funciones') ?? '').trim();
      permisosPredeterminados = String(fd.get('permisosPredeterminados') ?? '');
      const file = fd.get('imagen') as File | null;
      if (file) {
        if (!IMAGE_TYPES.includes(file.type)) return NextResponse.json({ error: 'Formato de imagen no permitido' }, { status: 415 });
        const buf = Buffer.from(await file.arrayBuffer());
        if (buf.byteLength > MAX_IMAGE_BYTES) return NextResponse.json({ error: `Imagen demasiado grande. Máx: ${MAX_IMAGE_MB}MB` }, { status: 413 });
        imagenNombre = `${crypto.randomUUID()}_${file.name}`;
        imagenBuf = buf;
        imagenUrl = `/api/almacenes/foto?nombre=${encodeURIComponent(imagenNombre)}`;
      }
    } else {
      const body = await req.json().catch(() => ({}));
      nombre = (body?.nombre ?? '').toString().trim();
      descripcion = (body?.descripcion ?? '').toString();
      funciones = (body?.funciones ?? '').toString();
      permisosPredeterminados = (body?.permisosPredeterminados ?? '').toString();
      imagenUrl = body?.imagenUrl ?? null;
      imagenNombre = body?.imagenNombre ?? null;
      imagenBuf = null;
    }

    if (!nombre) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });

    // asegurar entidad
    if (!usuario.entidadId) {
      const ent = await tryInsert<{ id: number }>(
        db,
        'entidad',
        [
          { nombre: `Entidad de ${usuario.nombre}`, tipo: normalizeTipoCuenta(usuario.tipoCuenta), correoContacto: usuario.correo ?? '' },
          { nombre: `Entidad de ${usuario.nombre}`, tipo: normalizeTipoCuenta(usuario.tipoCuenta), correo_contacto: usuario.correo ?? '' },
          { nombre: `Entidad de ${usuario.nombre}`, tipo: normalizeTipoCuenta(usuario.tipoCuenta) },
        ],
        'id',
      );
      await tryUpdate(db, 'usuario', [{ entidad_id: ent.id }, { entidadId: ent.id }], { id: usuario.id }).catch((e) =>
        logger.warn?.('update usuario.entidad_id', e),
      );
      usuario.entidadId = ent.id;
    }

    const codigoUnico = crypto.randomUUID().split('-')[0];
    const bytea = toByteaHex(imagenBuf);

    // **Inserción progresiva**: empieza mínima y luego añade campos opcionales
    const creado = await tryInsert<{
      id: number; nombre: string; descripcion: string | null; imagenNombre?: string | null; imagen_nombre?: string | null;
      imagenUrl?: string | null; imagen_url?: string | null; codigoUnico?: string; codigo_unico?: string;
    }>(
      db,
      'almacen',
      [
        // mínima segura (evita columnas que quizá no existan)
        {
          nombre,
          descripcion,
          codigoUnico,
          ...(bytea ? { imagen: bytea } : {}),
          entidadId: usuario.entidadId,
          imagenUrl,
          imagenNombre,
        },
        // snake-case
        {
          nombre,
          descripcion,
          codigo_unico: codigoUnico,
          ...(bytea ? { imagen: bytea } : {}),
          entidad_id: usuario.entidadId,
          imagen_url: imagenUrl,
          imagen_nombre: imagenNombre,
        },
        // con campos opcionales (camel)
        {
          nombre,
          descripcion,
          funciones,
          permisosPredeterminados,
          codigoUnico,
          ...(bytea ? { imagen: bytea } : {}),
          entidadId: usuario.entidadId,
          imagenUrl,
          imagenNombre,
        },
        // con campos opcionales (snake)
        {
          nombre,
          descripcion,
          funciones,
          permisos_predeterminados: permisosPredeterminados,
          codigo_unico: codigoUnico,
          ...(bytea ? { imagen: bytea } : {}),
          entidad_id: usuario.entidadId,
          imagen_url: imagenUrl,
          imagen_nombre: imagenNombre,
        },
      ],
      'id,nombre,descripcion,imagenNombre,imagenUrl,imagen_nombre,imagen_url,codigoUnico,codigo_unico',
    );

    // enlazar propietario
    try {
      await tryInsert(
        db,
        'usuario_almacen',
        [
          { usuarioId: usuario.id, almacenId: creado.id, rolEnAlmacen: 'propietario' },
          { usuario_id: usuario.id, almacen_id: creado.id, rol_en_almacen: 'propietario' },
        ],
        'almacenId',
      );
    } catch (e) {
      // rollback manual
      await db.from('almacen').delete().eq('id', creado.id).catch(() => {});
      return NextResponse.json({ error: msg(e, 'No se pudo asignar propietario') }, { status: 500 });
    }

    // side-effects no críticos
    snapshotAlmacen(db as any, creado.id, usuario.id, 'Creación').catch((e) => logger.warn?.('snapshotAlmacen', e));
    logAudit(usuario.id, 'creacion', 'almacen', { almacenId: creado.id }).catch((e) => logger.warn?.('logAudit', e));

    let auditoria = null, auditError = null as any;
    try {
      const r = await registrarAuditoria(req, 'almacen', creado.id, 'creacion', {
        nombre, descripcion, funciones, permisosPredeterminados,
      });
      auditoria = r.auditoria ?? null;
      auditError = r.error ?? null;
    } catch (e) {
      auditError = msg(e);
    }

    const imgNombre = (creado as any).imagenNombre ?? (creado as any).imagen_nombre ?? null;
    const imgUrl = (creado as any).imagenUrl ?? (creado as any).imagen_url ?? null;
    const cod = (creado as any).codigoUnico ?? (creado as any).codigo_unico;

    return NextResponse.json({
      almacen: {
        id: creado.id,
        nombre: (creado as any).nombre,
        descripcion: (creado as any).descripcion ?? null,
        codigoUnico: cod,
        imagenUrl: imgNombre ? `/api/almacenes/foto?nombre=${encodeURIComponent(imgNombre)}` : imgUrl,
      },
      auditoria,
      auditError,
    });
  } catch (err) {
    logger.error('POST /api/almacenes', err);
    return NextResponse.json({ error: msg(err, 'Error al crear almacén') }, { status: 500 });
  }
}
