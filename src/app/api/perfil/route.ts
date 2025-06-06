import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SESSION_COOKIE, sessionCookieOptions } from '@lib/constants';
import prisma from '@lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en el entorno');
}

const TAMAÑO_MAXIMO_FOTO_MB = 10;
const BYTES_MAXIMO_FOTO = TAMAÑO_MAXIMO_FOTO_MB * 1024 * 1024;
const TIPOS_FOTO_PERMITIDOS = [
  'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
];

const bloqueos = new Map<string, { intentos: number; timestamp: number }>();
const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO_MS = 5 * 60 * 1000;

function esCorreoValido(correo: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

async function guardarBitacoraCambio(usuarioId: number, cambios: any) {
  try {
    await prisma.bitacoraCambioPerfil.create({
      data: {
        usuarioId,
        cambios: JSON.stringify(cambios),
        fecha: new Date(),
      },
    });
  } catch {
    // Silencioso
  }
}

async function crearNotificacion(usuarioId: number, mensaje: string) {
  try {
    await prisma.notificacion.create({
      data: {
        usuarioId,
        mensaje,
        tipo: 'perfil',
        leida: false,
      },
    });
  } catch {
    // Silencioso
  }
}

// ===============================
//      GET: Obtener Perfil Actual
// ===============================
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        correo: true,
        tipoCuenta: true,
        entidadId: true,
        estado: true,
        fechaRegistro: true,
        fotoPerfilNombre: true,
        preferencias: true,
        tiene2FA: true,
        metodo2FA: true,
      },
    });

    if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });

    return NextResponse.json({ success: true, usuario }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'No se pudo cargar tu perfil.' }, { status: 500 });
  }
}

// ===============================
//      PUT: Actualizar Perfil
// ===============================
export async function PUT(req: NextRequest) {
  try {
    // Autenticación
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 });
    }
    const usuarioId = payload.id;

    // Manejo de JSON o multipart/form-data
    let body: any = {};
    let fotoBuffer: Buffer | null = null;
    let fotoNombre: string | null = null;

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData();
      body = {
        nombre: String(formData.get('nombre') ?? '').trim(),
        apellidos: String(formData.get('apellidos') ?? '').trim(),
        correo: String(formData.get('correo') ?? '').trim(),
        nuevaContrasena: String(formData.get('nuevaContrasena') ?? ''),
        contrasenaActual: String(formData.get('contrasenaActual') ?? ''),
        preferencias: String(formData.get('preferencias') ?? ''),
      };

      const foto = formData.get('foto') as File | null;
      if (foto) {
        if (!TIPOS_FOTO_PERMITIDOS.includes(foto.type)) {
          return NextResponse.json({ error: 'Formato de imagen no permitido.' }, { status: 415 });
        }
        const buffer = await foto.arrayBuffer();
        if (buffer.byteLength > BYTES_MAXIMO_FOTO) {
          return NextResponse.json({ error: `Imagen demasiado grande. Máx: ${TAMAÑO_MAXIMO_FOTO_MB}MB.` }, { status: 413 });
        }
        fotoBuffer = Buffer.from(buffer);
        fotoNombre = foto.name;
      }
    } else {
      body = await req.json();
    }

    const { nombre, apellidos, correo, nuevaContrasena, contrasenaActual, preferencias } = body;

    if (!nombre || !apellidos || !correo) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }
    if (!esCorreoValido(correo)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
    }

    // Verificar si el correo está en uso
    const correoExistente = await prisma.usuario.findUnique({ where: { correo } });
    if (correoExistente && correoExistente.id !== usuarioId) {
      return NextResponse.json({ error: 'Ese correo ya está registrado en otra cuenta.' }, { status: 409 });
    }

    // Cambio de contraseña
    let nuevoHash: string | undefined = undefined;
    if (nuevaContrasena) {
      if (nuevaContrasena.length < 6) {
        return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
      }
      const ip = req.headers.get('x-forwarded-for') || 'ip_desconocida';
      const key = `${usuarioId}:${ip}`;
      const now = Date.now();
      const reg = bloqueos.get(key) ?? { intentos: 0, timestamp: 0 };
      if (reg.intentos >= MAX_INTENTOS && now - reg.timestamp < TIEMPO_BLOQUEO_MS) {
        return NextResponse.json({ error: 'Demasiados intentos fallidos. Intenta de nuevo en unos minutos.' }, { status: 429 });
      }
      const usuarioActual = await prisma.usuario.findUnique({ where: { id: usuarioId } });
      if (!usuarioActual || !(await bcrypt.compare(contrasenaActual, usuarioActual.contrasena))) {
        bloqueos.set(key, { intentos: reg.intentos + 1, timestamp: now });
        return NextResponse.json({ error: 'Contraseña actual incorrecta.' }, { status: 401 });
      }
      bloqueos.set(key, { intentos: 0, timestamp: now });
      nuevoHash = await bcrypt.hash(nuevaContrasena, 10);
    }

    const data: any = { nombre, apellidos, correo };
    if (nuevoHash) data.contrasena = nuevoHash;
    if (fotoBuffer && fotoNombre) {
      data.fotoPerfil = fotoBuffer;
      data.fotoPerfilNombre = fotoNombre;
    }
    if (preferencias !== undefined) data.preferencias = preferencias;

    await prisma.usuario.update({
      where: { id: usuarioId },
      data,
    });

    await guardarBitacoraCambio(usuarioId, data);
    await crearNotificacion(usuarioId, 'Has actualizado tu perfil.');

    let tokenRefrescado: string | undefined;
    if (correo !== payload.correo) {
      const nuevoPayload = { ...payload, correo };
      tokenRefrescado = jwt.sign(nuevoPayload, JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
    }

    const res = NextResponse.json(
      { success: true, mensaje: 'Perfil actualizado correctamente.' },
      { status: 200 }
    );

    if (tokenRefrescado) {
      res.cookies.set(SESSION_COOKIE, tokenRefrescado, {
        ...sessionCookieOptions,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch (error: any) {
    console.error('[ERROR_UPDATE_PERFIL]', error);
    return NextResponse.json({ error: 'Error al actualizar perfil.', detalle: error.message }, { status: 500 });
  }
}

// ===============================
//      POST: Activar/Desactivar 2FA
// ===============================
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 });
    }
    const usuarioId = payload.id;

    const { activar2FA, metodo2FA } = await req.json();
    if (typeof activar2FA !== 'boolean' || (activar2FA && !['email', 'app'].includes(metodo2FA))) {
      return NextResponse.json({ error: 'Parámetros de 2FA inválidos.' }, { status: 400 });
    }

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        tiene2FA: activar2FA,
        metodo2FA: activar2FA ? metodo2FA : null,
      }
    });

    return NextResponse.json({
      success: true,
      mensaje: activar2FA ? '2FA activado' : '2FA desactivado'
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Error al gestionar 2FA.', detalle: error.message }, { status: 500 });
  }
}
