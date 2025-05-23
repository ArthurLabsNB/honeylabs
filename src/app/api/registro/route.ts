import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { enviarCorreoValidacionEmpresa } from '@/lib/email/enviarRegistro';

const prisma = new PrismaClient();

// 🔐 Configuración global de seguridad
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
    const formData = await req.formData();

    const nombre = formData.get('nombre')?.toString().trim() ?? '';
    const apellidos = formData.get('apellidos')?.toString().trim() ?? '';
    const correo = formData.get('correo')?.toLowerCase().trim() ?? '';
    const contrasena = formData.get('contrasena')?.toString() ?? '';
    const tipoCuenta = formData.get('tipoCuenta')?.toString() ?? '';
    const codigo = formData.get('codigo')?.toString().trim() ?? '';
    const archivo = formData.get('archivo') as File | null;

    // 🧪 Validaciones
    if (!nombre || !apellidos || !correo || !contrasena || !tipoCuenta) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    if (!esCorreoValido(correo)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
    }

    if ((tipoCuenta === 'empresarial' || tipoCuenta === 'institucional') && !archivo) {
      return NextResponse.json({ error: 'Se requiere un archivo de validación.' }, { status: 400 });
    }

    const existe = await prisma.usuario.findUnique({ where: { correo } });
    if (existe) {
      return NextResponse.json({ error: 'Ya existe una cuenta con ese correo.' }, { status: 409 });
    }

    // 📎 Procesar archivo si aplica
    let archivoNombre: string | null = null;
    let archivoBuffer: Buffer | null = null;

    if (archivo) {
      if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        return NextResponse.json({ error: 'Tipo de archivo no permitido.' }, { status: 415 });
      }

      const extension = obtenerExtension(archivo.name);
      if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
        return NextResponse.json({ error: 'Extensión de archivo no válida.' }, { status: 415 });
      }

      const archivoArrayBuffer = await archivo.arrayBuffer();
      if (archivoArrayBuffer.byteLength > BYTES_MAXIMOS) {
        return NextResponse.json({ error: `Archivo demasiado grande. Máx: ${TAMAÑO_MAXIMO_MB}MB.` }, { status: 413 });
      }

      archivoNombre = `${uuidv4()}_${archivo.name}`;
      archivoBuffer = Buffer.from(archivoArrayBuffer);
    }

    // 🏷 Validar código de invitación (si aplica)
    let entidadId: number | null = null;
    let codigoUsado: string | null = null;
    let estadoCuenta = 'activo';

    if (codigo) {
      const codigoEncontrado = await prisma.codigoAlmacen.findUnique({ where: { codigo } });
      if (!codigoEncontrado || !codigoEncontrado.activo) {
        return NextResponse.json({ error: 'Código inválido o caducado.' }, { status: 400 });
      }

      const almacen = await prisma.almacen.findUnique({
        where: { id: codigoEncontrado.almacenId },
        include: { entidad: true }
      });

      if (!almacen) {
        return NextResponse.json({ error: 'Error al asociar el almacén del código.' }, { status: 500 });
      }

      entidadId = almacen.entidadId;
      codigoUsado = codigo;
    }

    // 🕒 Empresas/instituciones → pendiente hasta validar
    if (['empresarial', 'institucional'].includes(tipoCuenta)) {
      estadoCuenta = 'pendiente';
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

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
        archivoBuffer
      }
    });

    // ✉️ Enviar notificación si requiere revisión manual
    if (estadoCuenta === 'pendiente') {
      await enviarCorreoValidacionEmpresa({ nombre, correo, tipoCuenta });
    }

    return NextResponse.json({
      success: true,
      mensaje: estadoCuenta === 'pendiente'
        ? 'Tu cuenta fue registrada y está pendiente de validación.'
        : 'Registro exitoso. Ya puedes iniciar sesión.'
    }, { status: 200 });

  } catch (error) {
    console.error('[ERROR_REGISTRO]', error);
    return NextResponse.json({ error: 'Error interno en el servidor.' }, { status: 500 });
  }
}
