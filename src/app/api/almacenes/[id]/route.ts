export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { promises as fs } from 'fs';
import path from 'path';
import { getUsuarioFromSession } from "@lib/auth";
import crypto from 'node:crypto';

const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const almacen = await prisma.almacen.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        imagenUrl: true,
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
    return NextResponse.json({
      almacen: {
        id: almacen.id,
        nombre: almacen.nombre,
        descripcion: almacen.descripcion,
        imagenUrl: almacen.imagenUrl,
        encargado: almacen.usuarios[0]?.usuario.nombre ?? null,
        correo: almacen.usuarios[0]?.usuario.correo ?? null,
        ultimaActualizacion: almacen.movimientos[0]?.fecha ?? null,
      },
    });
  } catch (err) {
    console.error("Error en /api/almacenes/[id]", err);
    return NextResponse.json({ error: "Error al obtener almacén" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = Number(params.id);
    await prisma.$transaction([
      prisma.usuarioAlmacen.deleteMany({ where: { almacenId: id } }),
      prisma.codigoAlmacen.deleteMany({ where: { almacenId: id } }),
      prisma.movimiento.deleteMany({ where: { almacenId: id } }),
      prisma.eventoAlmacen.deleteMany({ where: { almacenId: id } }),
      prisma.novedadAlmacen.deleteMany({ where: { almacenId: id } }),
      prisma.documentoAlmacen.deleteMany({ where: { almacenId: id } }),
      prisma.incidencia.deleteMany({ where: { almacenId: id } }),
      prisma.notificacion.deleteMany({ where: { almacenId: id } }),
      prisma.alerta.deleteMany({ where: { almacenId: id } }),
      prisma.almacen.delete({ where: { id } }),
    ]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/almacenes/[id]', err);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await getUsuarioFromSession();
    if (!usuario) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const id = Number(params.id);

  let nombre = '';
  let descripcion = '';
  let imagenUrl: string | undefined = undefined;
  let prevImagenUrl = '';

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData();
      nombre = String(formData.get('nombre') ?? '').trim();
      descripcion = String(formData.get('descripcion') ?? '').trim();
      prevImagenUrl = String(formData.get('prevImagenUrl') ?? '');
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
        const dir = path.join(process.cwd(), 'public/almacenes');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, nombreArchivo), buffer);
        imagenUrl = `/almacenes/${nombreArchivo}`;
      }
    } else {
      const body = await req.json();
      nombre = body.nombre;
      descripcion = body.descripcion;
      imagenUrl = body.imagenUrl;
      prevImagenUrl = body.prevImagenUrl ?? '';
    }

    const almacen = await prisma.almacen.update({
      where: { id },
      data: { nombre, descripcion, imagenUrl },
      select: { id: true, nombre: true, descripcion: true, imagenUrl: true },
    });

    if (prevImagenUrl && imagenUrl && prevImagenUrl !== imagenUrl) {
      const oldPath = path.join(process.cwd(), 'public', prevImagenUrl);
      fs.unlink(oldPath).catch(() => {});
    }
    return NextResponse.json({ almacen });
  } catch (err) {
    console.error('PUT /api/almacenes/[id]', err);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}
