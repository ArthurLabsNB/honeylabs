export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SESSION_COOKIE, sessionCookieOptions } from '@lib/constants';
import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import * as logger from '@lib/logger'
import { respuestaError } from '@lib/http'

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

const supabase = getDb().client as SupabaseClient;

function esCorreoValido(correo: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

async function guardarBitacoraCambio(usuarioId: number, cambios: any) {
  try {
    await supabase.from('BitacoraCambioPerfil').insert({
      usuarioId,
      cambios: JSON.stringify(cambios),
      fecha: new Date().toISOString(),
    });
  } catch {
    // Silencioso
  }
}

async function crearNotificacion(usuarioId: number, mensaje: string) {
  try {
    await supabase.from('Notificacion').insert({
      usuarioId,
      mensaje,
      tipo: 'perfil',
      leida: false,
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
    if (!token) return respuestaError('No autenticado.', 'Token faltante', 401)

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return respuestaError('Sesión inválida o expirada.', 'Token inválido', 401)
    }

    logger.debug(req, 'Buscando perfil del usuario')
    const { data, error } = await supabase
      .from('usuario')
      .select('id,nombre,apellidos,correo,tipo_cuenta,entidad_id,estado,fecha_registro,fotoPerfilNombre,preferencias,tiene2FA,metodo2FA')
      .eq('id', payload.id)
      .maybeSingle()

    if (error) throw error
    if (!data) return respuestaError('Usuario no encontrado.', 'ID inexistente', 404)

    const usuario = {
      ...data,
      tipoCuenta: (data as any).tipo_cuenta,
      entidadId: (data as any).entidad_id,
      fechaRegistro: (data as any).fecha_registro,
    }
    delete (usuario as any).tipo_cuenta
    delete (usuario as any).entidad_id
    delete (usuario as any).fecha_registro

    logger.info(req, 'Perfil recuperado correctamente')
    return NextResponse.json({ success: true, usuario }, { status: 200 })
  } catch (error: any) {
    logger.error(req, '[ERROR_GET_PERFIL]', error)
    return respuestaError('No se pudo cargar tu perfil.', error.message, 500)
  }
}

// ===============================
//      PUT: Actualizar Perfil
// ===============================
export async function PUT(req: NextRequest) {
  try {
    // Autenticación
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return respuestaError('No autenticado.', 'Token faltante', 401)

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return respuestaError('Sesión inválida o expirada.', 'Token inválido', 401)
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
          return respuestaError('Formato de imagen no permitido.', foto.type, 415)
        }
        const buffer = await foto.arrayBuffer();
        if (buffer.byteLength > BYTES_MAXIMO_FOTO) {
          return respuestaError(`Imagen demasiado grande. Máx: ${TAMAÑO_MAXIMO_FOTO_MB}MB.`, String(buffer.byteLength), 413)
        }
        fotoBuffer = Buffer.from(buffer);
        fotoNombre = foto.name;
      }
    } else {
      body = await req.json();
    }

    const { nombre, apellidos, correo, nuevaContrasena, contrasenaActual, preferencias } = body;

    if (!nombre || !apellidos || !correo) {
      return respuestaError('Faltan campos obligatorios.', 'nombre, apellidos o correo', 400)
    }
    if (!esCorreoValido(correo)) {
      return respuestaError('Correo inválido.', correo, 400)
    }

    // Verificar si el correo está en uso
    const { data: correoExistente, error: correoError } = await supabase
      .from('usuario')
      .select('id')
      .eq('correo', correo)
      .maybeSingle()
    if (correoError) throw correoError
    if (correoExistente && correoExistente.id !== usuarioId) {
      return respuestaError('Ese correo ya está registrado en otra cuenta.', correo, 409)
    }

    // Cambio de contraseña
    let nuevoHash: string | undefined = undefined;
    if (nuevaContrasena) {
      if (nuevaContrasena.length < 6) {
        return respuestaError('La nueva contraseña debe tener al menos 6 caracteres.', '', 400)
      }
      const ip = req.headers.get('x-forwarded-for') || 'ip_desconocida';
      const key = `${usuarioId}:${ip}`;
      const now = Date.now();
      const reg = bloqueos.get(key) ?? { intentos: 0, timestamp: 0 };
      if (reg.intentos >= MAX_INTENTOS && now - reg.timestamp < TIEMPO_BLOQUEO_MS) {
        return respuestaError('Demasiados intentos fallidos. Intenta de nuevo en unos minutos.', '', 429)
      }
      const { data: usuarioActual, error: usuarioError } = await supabase
        .from('usuario')
        .select('contrasena')
        .eq('id', usuarioId)
        .single()
      if (usuarioError || !usuarioActual || !(await bcrypt.compare(contrasenaActual, usuarioActual.contrasena))) {
        bloqueos.set(key, { intentos: reg.intentos + 1, timestamp: now });
        return respuestaError('Contraseña actual incorrecta.', '', 401)
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

    logger.debug(req, 'Actualizando datos del usuario')
    const { error: updateError } = await supabase
      .from('usuario')
      .update(data)
      .eq('id', usuarioId)
    if (updateError) throw updateError

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
    )

    if (tokenRefrescado) {
      res.cookies.set(SESSION_COOKIE, tokenRefrescado, {
        ...sessionCookieOptions,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    logger.info(req, 'Perfil actualizado')
    return res
  } catch (error: any) {
    logger.error(req, '[ERROR_UPDATE_PERFIL]', error)
    return respuestaError('Error al actualizar perfil.', error.message, 500)
  }
}

// ===============================
//      POST: Activar/Desactivar 2FA
// ===============================
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return respuestaError('No autenticado.', 'Token faltante', 401)

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return respuestaError('Sesión inválida o expirada.', 'Token inválido', 401)
    }
    const usuarioId = payload.id;

    const { activar2FA, metodo2FA } = await req.json();
    if (typeof activar2FA !== 'boolean' || (activar2FA && !['email', 'app'].includes(metodo2FA))) {
      return respuestaError('Parámetros de 2FA inválidos.', '', 400)
    }

    const { error } = await supabase
      .from('usuario')
      .update({
        tiene2FA: activar2FA,
        metodo2FA: activar2FA ? metodo2FA : null,
      })
      .eq('id', usuarioId)
    if (error) throw error

    logger.info(req, activar2FA ? '2FA activado' : '2FA desactivado')
    return NextResponse.json({
      success: true,
      mensaje: activar2FA ? '2FA activado' : '2FA desactivado'
    }, { status: 200 })

  } catch (error: any) {
    logger.error(req, '[ERROR_2FA]', error)
    return respuestaError('Error al gestionar 2FA.', error.message, 500)
  }
}
