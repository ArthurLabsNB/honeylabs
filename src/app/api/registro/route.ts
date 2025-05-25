export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { enviarCorreoValidacionEmpresa } from '@/lib/email/enviarRegistro';

const prisma = new PrismaClient();

const TAMAÑO_MAXIMO_MB = 2;
const BYTES_MAXIMOS = TAMAÑO_MAXIMO_MB * 1024 * 1024;
const EXTENSIONES_PERMITIDAS = ['.pdf', '.png', '.jpg', '.jpeg'];
const TIPOS_PERMITIDOS = ['application/pdf', 'image/png', 'image/jpeg'];

function esCorreoValido(correo: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

function obtenerExtension(nombre: string): string {
  return nombre.slice(nombre.lastIndexOf('.')).toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    console.info('📥 Iniciando registro de usuario');
    const formData = await req.formData();

    const nombre = String(formData.get('nombre') ?? '').trim();
    const apellidos = String(formData.get('apellidos') ?? '').trim();
    const correo = String(formData.get('correo') ?? '').trim().toLowerCase();
    const contrasena = String(formData.get('contrasena') ?? '');
    const tipoCuenta = String(formData.get('tipoCuenta') ?? '');
    const codigo = String(formData.get('codigo') ?? '').trim();
    const archivo = formData.get('archivo') as File | null;

    if (!nombre || !apellidos || !correo || !contrasena || !tipoCuenta) {
      console.warn('❗ Campos requeridos faltantes');
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    if (!esCorreoValido(correo)) {
      console.warn('❗ Correo inválido:', correo);
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
    }

    const existente = await prisma.usuario.findUnique({ where: { correo } });
    if (existente) {
      console.warn('⚠️ Correo ya registrado:', correo);
      return NextResponse.json({ error: 'Ya existe una cuenta con ese correo.' }, { status: 409 });
    }

    const requiereArchivo = ['empresarial', 'institucional'].includes(tipoCuenta);
    let archivoNombre: string | null = null;
    let archivoBuffer: Buffer | null = null;

    if (requiereArchivo) {
      if (!archivo) return NextResponse.json({ error: 'Se requiere un archivo de validación.' }, { status: 400 });
      console.log('📎 Tipo de archivo recibido:', archivo.type);

      if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        return NextResponse.json({ error: 'Tipo de archivo no permitido.' }, { status: 415 });
      }

      const extension = obtenerExtension(archivo.name);
      if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
        return NextResponse.json({ error: 'Extensión de archivo no válida.' }, { status: 415 });
      }

      try {
        const buffer = await archivo.arrayBuffer();
        if (buffer.byteLength > BYTES_MAXIMOS) {
          return NextResponse.json({ error: `Archivo demasiado grande. Máx: ${TAMAÑO_MAXIMO_MB}MB.` }, { status: 413 });
        }

        archivoNombre = `${uuidv4()}_${archivo.name}`;
        archivoBuffer = Buffer.from(buffer);
      } catch (err: any) {
        console.error('❌ Error al procesar archivo:', err);
        return NextResponse.json({
          error: 'No se pudo procesar el archivo.',
          detalle: err.message,
        }, { status: 500 });
      }
    }

    let entidadId: number | null = null;
    let codigoUsado: string | null = null;
    let estadoCuenta = requiereArchivo ? 'pendiente' : 'activo';

    if (codigo) {
      try {
        const codigoEncontrado = await prisma.codigoAlmacen.findUnique({ where: { codigo } });
        if (!codigoEncontrado || !codigoEncontrado.activo) {
          return NextResponse.json({ error: 'Código inválido o caducado.' }, { status: 400 });
        }

        const almacen = await prisma.almacen.findUnique({
          where: { id: codigoEncontrado.almacenId },
          include: { entidad: true },
        });

        if (!almacen) {
          return NextResponse.json({ error: 'Error al asociar el almacén del código.' }, { status: 500 });
        }

        entidadId = almacen.entidadId;
        codigoUsado = codigo;
      } catch (err: any) {
        console.error('❌ Error en validación de código:', err);
        return NextResponse.json({
          error: 'Fallo al validar el código proporcionado.',
          detalle: err.message,
        }, { status: 500 });
      }
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Información previa a creación
    console.log('📄 Datos a insertar:', {
      nombre, apellidos, correo, tipoCuenta, estadoCuenta, entidadId, archivoNombre, tieneArchivo: !!archivoBuffer,
    });

    try {
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          apellidos,
          correo,
          contrasena: hashedPassword,
          tipoCuenta,
          estado: estadoCuenta,
          fechaRegistro: new Date(),
          entidadId,
          codigoUsado,
          archivoNombre,
          archivoBuffer,
        },
      });

      console.info('✅ Usuario creado:', nuevoUsuario.id, correo);

      if (estadoCuenta === 'pendiente') {
        const enviado = await enviarCorreoValidacionEmpresa({ nombre, correo, tipoCuenta });
        if (!enviado.enviado) {
          console.warn('⚠️ Error al enviar correo de validación:', enviado.error);
        }
      }

      return NextResponse.json({
        success: true,
        mensaje: estadoCuenta === 'pendiente'
          ? 'Tu cuenta fue registrada y está pendiente de validación.'
          : 'Registro exitoso. Ya puedes iniciar sesión.',
      }, { status: 200 });

    } catch (err: any) {
      console.error('❌ Error al crear usuario:', err);
      return NextResponse.json({
        error: 'Error al guardar el usuario.',
        nombre: err.name,
        mensaje: err.message,
        stack: err.stack,
        datosIntentados: {
          correo,
          entidadId,
          archivoNombre,
          tieneArchivo: !!archivoBuffer
        }
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ [ERROR_REGISTRO_GENERAL]', error);
    return NextResponse.json({
      error: 'Error general del servidor al procesar el registro.',
      nombre: error.name,
      mensaje: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
