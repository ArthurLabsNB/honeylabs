
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import type { Prisma } from '@prisma/client'
import crypto from "node:crypto";
import { getUsuarioFromSession } from "@lib/auth";
import { hasManagePerms, normalizeTipoCuenta } from "@lib/permisos";
import * as logger from '@lib/logger'
import { logAudit } from '@/lib/audit'
import { registrarAuditoria } from '@lib/reporter'

const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
];

async function snapshot(
  db: Prisma.TransactionClient | typeof prisma,
  almacenId: number,
  usuarioId: number,
  descripcion: string,
) {
  const almacen = await db.almacen.findUnique({
    where: { id: almacenId },
    select: {
      nombre: true,
      descripcion: true,
      imagen: true,
      imagenNombre: true,
      imagenUrl: true,
      codigoUnico: true,
    },
  })
  const estado = almacen
    ? {
        ...almacen,
        imagen: almacen.imagen
          ? Buffer.from(almacen.imagen as Buffer).toString('base64')
          : null,
      }
    : null
  await db.historialAlmacen.create({
    data: { almacenId, usuarioId, descripcion, estado },
  })
}

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

    const where = { usuarios: { some: { usuarioId: targetId } } };

    const data = await prisma.almacen.findMany({
      take: 20,
      orderBy: { id: 'asc' },
      where,
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        imagenUrl: true,
        imagenNombre: true,
        fechaCreacion: true,
        codigoUnico: true,
        usuarios: {
          take: 1,
          select: {
            usuario: { select: { nombre: true, correo: true } },
          },
        },
        movimientos: {
          orderBy: { fecha: "desc" },
          take: 1,
          select: { fecha: true },
        },
        notificaciones: {
          where: { leida: false },
          select: { id: true },
        },
      },
    });

    const ids = data.map((a) => a.id);
    const counts: Record<number, { entradas: number; salidas: number }> = {};
    const materiales: Record<number, number> = {};
    ids.forEach((id) => {
      counts[id] = { entradas: 0, salidas: 0 };
      materiales[id] = 0;
    });

    if (ids.length > 0) {
      const movs = await prisma.movimiento.groupBy({
        by: ["almacenId", "tipo"],
        _sum: { cantidad: true },
        where: { almacenId: { in: ids } },
      });

      for (const m of movs) {
        if (m.tipo === "entrada") counts[m.almacenId].entradas = m._sum.cantidad ?? 0;
        if (m.tipo === "salida") counts[m.almacenId].salidas = m._sum.cantidad ?? 0;
      }

      const mats = await prisma.material.groupBy({
        by: ["almacenId"],
        _count: { _all: true },
        where: { almacenId: { in: ids } },
      });
      for (const m of mats) materiales[m.almacenId] = m._count._all;
    }

    let orden: number[] = []
    if (targetId) {
      const prefsUser = await prisma.usuario.findUnique({
        where: { id: targetId },
        select: { preferencias: true },
      })
      if (prefsUser?.preferencias) {
        try {
          const p = JSON.parse(prefsUser.preferencias)
          if (Array.isArray(p.ordenAlmacenes)) orden = p.ordenAlmacenes
        } catch {}
      }
    }

    const almacenes = data.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      descripcion: a.descripcion,
      imagenUrl: a.imagenNombre ? `/api/almacenes/foto?nombre=${encodeURIComponent(a.imagenNombre)}` : a.imagenUrl,
      codigoUnico: a.codigoUnico,
      fechaCreacion: a.fechaCreacion,
      encargado: a.usuarios[0]?.usuario.nombre ?? null,
      correo: a.usuarios[0]?.usuario.correo ?? null,
      ultimaActualizacion: a.movimientos[0]?.fecha ?? null,
      notificaciones: a.notificaciones.length,
      entradas: counts[a.id].entradas,
      salidas: counts[a.id].salidas,
      inventario: materiales[a.id],
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
          usuarios: {
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
      await snapshot(tx, creado.id, usuario.id, 'Creación')
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
