import nodemailer from 'nodemailer';
import { plantillaRegistroHTML } from '@/templates/email/registro.html';
import { plantillaConfirmacionHTML } from '@/templates/email/confirmacion.html';
import { getCorreoDestino } from './rutasCorreo';

// ✅ Variables de entorno requeridas
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!EMAIL_ADMIN || !SMTP_USER || !SMTP_PASS) {
  throw new Error('❌ Faltan variables de entorno para el sistema de correo (EMAIL_ADMIN, SMTP_USER o SMTP_PASS)');
}

/**
 * Envía correos al momento de registrar una cuenta:
 * - Al administrador (según tipoCuenta)
 * - Al usuario registrado (copia confirmación)
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
    // ✉️ Configurar transporte SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // 🧠 Correo de destino según tipoCuenta
    const correoDestino = getCorreoDestino(tipoCuenta);
    console.log('[DESTINO_CORREO]', correoDestino);

    // 🧾 Plantillas
    const htmlInterno = plantillaRegistroHTML({ nombre, correo, tipoCuenta });
    const htmlUsuario = plantillaConfirmacionHTML({ nombre, tipoCuenta });

    // 📬 Correo administrativo (a validaciones o registro general)
    const envioInterno = await transporter.sendMail({
      from: `"HoneyLabs Registro" <${SMTP_USER}>`,
      to: correoDestino,
      bcc: EMAIL_ADMIN,
      subject: `📝 Nuevo registro pendiente: ${tipoCuenta.toUpperCase()} - ${correo}`,
      html: htmlInterno,
    });

    console.log('[EMAIL_INTERNO_ENVIADO]', envioInterno.messageId);

    // 📬 Correo de confirmación al usuario
    const envioUsuario = await transporter.sendMail({
      from: `"HoneyLabs" <${SMTP_USER}>`,
      to: correo,
      subject: '🎉 ¡Bienvenido a HoneyLabs!',
      html: htmlUsuario,
    });

    console.log('[EMAIL_USUARIO_ENVIADO]', envioUsuario.messageId);

    return { enviado: true };

  } catch (error: any) {
    console.error('[ERROR_EMAIL_VALIDACION]', error.message || error);
    return {
      enviado: false,
      error: error.message || 'Error desconocido',
    };
  }
}
