import nodemailer from 'nodemailer';
import { plantillaRegistroHTML } from '@/templates/email/registro.html';

// ✅ Variables de entorno obligatorias (se deben definir en `.env`)
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_USER = process.env.SMTP_USER;

if (!EMAIL_ADMIN || !SMTP_USER || !SMTP_PASS) {
  throw new Error('❌ Faltan variables de entorno para el sistema de correo (EMAIL_ADMIN, SMTP_USER o SMTP_PASS)');
}

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
    // ✉️ Configuración del transporte SMTP (ej. Gmail, Mailjet, MailerSend, etc.)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const html = plantillaRegistroHTML({ nombre, correo, tipoCuenta });

    const info = await transporter.sendMail({
      from: `"HoneyLabs Registro" <${SMTP_USER}>`,
      to: EMAIL_ADMIN,
      subject: `📝 Nuevo registro pendiente: ${tipoCuenta.toUpperCase()} - ${correo}`,
      html,
    });

    console.log('[EMAIL_ENVIADO]', info.messageId);
    return { enviado: true };
  } catch (error: any) {
    console.error('[ERROR_EMAIL_VALIDACION]', error.message || error);
    return { enviado: false, error: error.message || 'Error desconocido' };
  }
}
