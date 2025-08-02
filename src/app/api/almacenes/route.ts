
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@lib/db';
import type { Prisma } from '@prisma/client'

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
  const prisma = getDb().client as any
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

    const { data, error } = await db
      .from('almacen')
      .select('id, nombre, descripcion, imagenUrl, imagenNombre, fechaCreacion, codigoUnico')
      .in('id', ids)
      .order('id', { ascending: true })
    if (error) throw error

    const counts: Record<number, { entradas: number; salidas: number }> = {}
    const materiales: Record<number, number> = {}
    const unidades: Record<number, number> = {}
    const ultima: Record<number, string | null> = {}
    const notifs: Record<number, number> = {}
    const encargados: Record<number, { nombre: string | null; correo: string | null }> = {}
    ids.forEach((id) => {
      counts[id] = { entradas: 0, salidas: 0 }
      materiales[id] = 0
      unidades[id] = 0
      ultima[id] = null
      notifs[id] = 0
      encargados[id] = { nombre: null, correo: null }
    })

    const { data: encargadosData, error: encError } = await db
      .from('usuario_almacen')
      .select('almacenId, usuario:usuario(nombre, correo)')
      .in('almacenId', ids)
    if (encError) throw encError
    for (const e of encargadosData ?? []) {
      if (!encargados[e.almacenId].nombre) {
        encargados[e.almacenId] = {
          nombre: e.usuario?.nombre ?? null,
          correo: e.usuario?.correo ?? null,
        }
      }
    }

    const { data: notifData, error: notifError } = await db
      .from('notificacion')
      .select('almacenId')
      .eq('leida', false)
      .in('almacenId', ids)
    if (notifError) throw notifError
    for (const n of notifData ?? []) {
      notifs[n.almacenId] = (notifs[n.almacenId] ?? 0) + 1
    }

    const { data: movs, error: movError } = await db
      .from('movimiento')
      .select('almacenId, tipo, sum:cantidad', { group: 'almacenId,tipo' })
      .in('almacenId', ids)
    if (movError) throw movError
    for (const m of movs ?? []) {
      const sum = (m as any).sum ?? (m as any).sum_cantidad ?? (m as any).cantidad
      if (m.tipo === 'entrada') counts[m.almacenId].entradas = sum ?? 0
      if (m.tipo === 'salida') counts[m.almacenId].salidas = sum ?? 0
    }

    const { data: movFechas, error: fechaError } = await db
      .from('movimiento')
      .select('almacenId, max:fecha', { group: 'almacenId' })
      .in('almacenId', ids)
    if (fechaError) throw fechaError
    for (const f of movFechas ?? []) {
      ultima[f.almacenId] = (f as any).max ?? null
    }

    const { data: mats, error: matsError } = await db
      .from('material')
      .select('almacenId, count:id', { group: 'almacenId' })
      .in('almacenId', ids)
    if (matsError) throw matsError
    for (const m of mats ?? []) {
      materiales[m.almacenId] = (m as any).count ?? 0
    }

    const { data: unidadRows, error: uniError } = await db
      .from('material_unidad')
      .select('material:material(almacenId)')
      .in('material.almacenId', ids)
    if (uniError) throw uniError
    for (const u of unidadRows ?? []) {
      const id = (u as any).material?.almacenId
      if (id != null) unidades[id] = (unidades[id] ?? 0) + 1
    }

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
      encargado: encargados[a.id].nombre,
      correo: encargados[a.id].correo,
      ultimaActualizacion: ultima[a.id],
      notificaciones: notifs[a.id] ?? 0,
      entradas: counts[a.id].entradas,
      salidas: counts[a.id].salidas,
      inventario: materiales[a.id],
      unidades: unidades[a.id],
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
  const prisma = getDb().client as any
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const prisma = getDb().client as any

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
      const nuevaEntidad = await prisma.entidad.create({
        data: {
          nombre: `Entidad de ${usuario.nombre}`,
          tipo: normalizeTipoCuenta(usuario.tipoCuenta),
          correoContacto: usuario.correo ?? '',
        },
      });
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { entidadId: nuevaEntidad.id },
      });
      usuario.entidadId = nuevaEntidad.id;
    }

    const codigoUnico = crypto.randomUUID().split('-')[0];

  const almacen = await prisma.$transaction(async tx => {
      const creado = await tx.almacen.create({
        data: {
          nombre,
          descripcion,
          funciones,
          permisosPredeterminados,
          codigoUnico,
          imagenUrl,
          imagenNombre,
          imagen: imagenBuffer,
          entidadId: usuario.entidadId,
          usuario_almacen: {
            create: { usuarioId: usuario.id, rolEnAlmacen: 'propietario' },
          },
        },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          imagenNombre: true,
          imagenUrl: true,
          codigoUnico: true,
        },
      })
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
