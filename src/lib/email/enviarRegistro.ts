import nodemailer from 'nodemailer';
import { plantillaRegistroHTML } from '@/templates/email/registro.html';
import { plantillaConfirmacionHTML } from '@/templates/email/confirmacion.html';
import { getCorreoDestino } from './rutasCorreo';
import * as logger from '@lib/logger'

// ✅ Variables de entorno requeridas
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!EMAIL_ADMIN || !SMTP_USER || !SMTP_PASS) {
  throw new Error('❌ Faltan variables de entorno para el sistema de correo (EMAIL_ADMIN, SMTP_USER o SMTP_PASS)');
}

/**
 * Envía los correos correspondientes al registrar una cuenta:
 * - Notificación al equipo (registro o validación)
 * - Confirmación individual al usuario
 */
export async function enviarCorreoValidacionEmpresa({
  nombre,
  correo,
  tipoCuenta,
}: {
  nombre: string;
  correo: string;
  tipoCuenta: string;
}) {
  try {
    // 📨 Configurar el transporte SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // 📍 Determinar a qué correo enviar la notificación interna
    const correoDestino = getCorreoDestino(tipoCuenta);
    logger.info('[DESTINO_CORREO_INTERNO]', correoDestino);

    // 🧾 Generar plantillas personalizadas
    const htmlInterno = plantillaRegistroHTML({ nombre, correo, tipoCuenta });
    const htmlUsuario = plantillaConfirmacionHTML({ nombre, tipoCuenta });

    // 📬 1. Correo al sistema de validación o registro interno
    const envioInterno = await transporter.sendMail({
      from: `"HoneyLabs Registro" <${SMTP_USER}>`,
      to: correoDestino,
      bcc: EMAIL_ADMIN, // Registro oculto de auditoría
      subject: `📝 Nuevo registro pendiente: ${tipoCuenta.toUpperCase()} - ${correo}`,
      html: htmlInterno,
    });

    logger.info('[✅ EMAIL INTERNO ENVIADO]', envioInterno.messageId);

    // 📬 2. Correo directo al usuario
    const envioUsuario = await transporter.sendMail({
      from: `"HoneyLabs" <${SMTP_USER}>`,
      to: correo, // Solo el usuario
      subject: '🎉 ¡Bienvenido a HoneyLabs!',
      html: htmlUsuario,
    });

    logger.info('[✅ EMAIL USUARIO ENVIADO]', envioUsuario.messageId);

    return { enviado: true };

  } catch (error: any) {
    logger.error('[❌ ERROR ENVÍO CORREO]', error.message || error);
    return {
      enviado: false,
      error: error.message || 'Error desconocido',
    };
  }
}
