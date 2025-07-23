import nodemailer from 'nodemailer';
import { plantillaResetContrasenaHTML } from '@/templates/email/resetContrasena.html';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_USER || !SMTP_PASS) {
  throw new Error('SMTP_USER o SMTP_PASS faltantes');
}

export async function enviarCorreoResetContrasena({
  correo,
  nombre,
  enlace,
}: {
  correo: string;
  nombre: string;
  enlace: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const html = plantillaResetContrasenaHTML({ nombre, enlace });
    const info = await transporter.sendMail({
      from: `"HoneyLabs" <${SMTP_USER}>`,
      to: correo,
      subject: 'Restablecer contraseña',
      html,
    });

    console.log('[EMAIL_RESET_ENVIADO]', info.messageId);
    return { enviado: true };
  } catch (error: any) {
    console.error('[ERROR_EMAIL_RESET]', error);
    return { enviado: false, error: error.message };
  }
}
