export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@lib/db/prisma';
import type { Prisma } from '@prisma/client';
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
  logger.debug(req, 'GET /api/almacenes/[id]')
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = getAlmacenId(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: id },
      select: { id: true },
    });
    if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    const almacen = await prisma.almacen.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        imagenUrl: true,
        imagenNombre: true,
        usuarios: {
          take: 1,
          select: {
            usuario: { select: { nombre: true, correo: true } },
          },
        },
        movimientos: {
          orderBy: { fecha: 'desc' },
          take: 1,
          select: { fecha: true },
        },
      },
    });
    if (!almacen) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const resumen = await prisma.movimiento.groupBy({
      by: ["tipo"],
      _sum: { cantidad: true },
      where: { almacenId: id },
    });
    let entradas = 0;
    let salidas = 0;
    for (const r of resumen) {
      if (r.tipo === "entrada") entradas = r._sum.cantidad ?? 0;
      if (r.tipo === "salida") salidas = r._sum.cantidad ?? 0;
    }

    const totalMateriales = await prisma.material.count({ where: { almacenId: id } });

    const materiales = await prisma.material.findMany({
      where: { almacenId: id },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        miniaturaNombre: true,
        cantidad: true,
        unidad: true,
        lote: true,
        fechaCaducidad: true,
        ubicacion: true,
        proveedor: true,
        estado: true,
        observaciones: true,
        minimo: true,
        maximo: true,
        fechaRegistro: true,
        fechaActualizacion: true,
      },
    })

    const res = NextResponse.json({
      almacen: {
        id: almacen.id,
        nombre: almacen.nombre,
        descripcion: almacen.descripcion,
        imagenUrl: almacen.imagenNombre ? `/api/almacenes/foto?nombre=${encodeURIComponent(almacen.imagenNombre)}` : almacen.imagenUrl,
        encargado: almacen.usuarios[0]?.usuario.nombre ?? null,
        correo: almacen.usuarios[0]?.usuario.correo ?? null,
        ultimaActualizacion: almacen.movimientos[0]?.fecha ?? null,
        entradas,
        salidas,
        inventario: totalMateriales,
        materiales,
      },
    })
    logger.info(req, `Almacén ${id} consultado`)
    return res
  } catch (err) {
    logger.error("Error en /api/almacenes/[id]", err);
    return NextResponse.json({ error: "Error al obtener almacén" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = getAlmacenId(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: id },
      select: { id: true },
    });
  if (!pertenece && !hasManagePerms(usuario)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
  let motivo = ''
  try {
    const body = await req.json()
    motivo = String(body?.motivo ?? '').trim()
  } catch {}

  await prisma.$transaction(async tx => {
      await snapshotAlmacen(tx, id, usuario.id, 'Eliminación')
      await tx.usuarioAlmacen.deleteMany({ where: { almacenId: id } })
      await tx.codigoAlmacen.deleteMany({ where: { almacenId: id } })
      await tx.movimiento.deleteMany({ where: { almacenId: id } })
      await tx.eventoAlmacen.deleteMany({ where: { almacenId: id } })
      await tx.novedadAlmacen.deleteMany({ where: { almacenId: id } })
      await tx.documentoAlmacen.deleteMany({ where: { almacenId: id } })
      await tx.incidencia.deleteMany({ where: { almacenId: id } })
      await tx.notificacion.deleteMany({ where: { almacenId: id } })
      await tx.alerta.deleteMany({ where: { almacenId: id } })
      await tx.historialLote.deleteMany({ where: { material: { almacenId: id } } })
      await tx.materialUnidad.deleteMany({ where: { material: { almacenId: id } } })
      await tx.archivoMaterial.deleteMany({ where: { material: { almacenId: id } } })
      await tx.material.deleteMany({ where: { almacenId: id } })
      await tx.almacen.delete({ where: { id } })
  })

  await logAudit(usuario.id, 'eliminacion', 'almacen', { almacenId: id })

  const { auditoria, error: auditError } = await registrarAuditoria(
    req,
    'almacen',
    id,
    'eliminacion',
    { motivo },
  )
    return NextResponse.json({ success: true, auditoria, auditError });
  } catch (err) {
    logger.error('DELETE /api/almacenes/[id]', err);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req);
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = getAlmacenId(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: id },
      select: { id: true },
    });
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
      const body = await req.json();
      nombre = body.nombre;
      descripcion = body.descripcion;
      imagenUrl = body.imagenUrl;
      imagenNombre = body.imagenNombre ?? null;
    }

  const almacen = await prisma.$transaction(async tx => {
      const upd = await tx.almacen.update({
        where: { id },
        data: {
          nombre,
          descripcion,
          imagenUrl,
          imagenNombre,
          imagen: imagenBuffer,
        },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          imagenNombre: true,
          imagenUrl: true,
        },
      })
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
    logger.error('PUT /api/almacenes/[id]', err);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}
