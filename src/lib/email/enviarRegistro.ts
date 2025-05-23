import nodemailer from 'nodemailer';
import { plantillaRegistroHTML } from '@/templates/email/registro.html';

// 📧 Configura aquí el correo del equipo administrador
const EMAIL_ADMIN = process.env.EMAIL_ADMIN ?? 'admin@honeylabs.mx';
const SMTP_PASS = process.env.SMTP_PASS ?? '';
const SMTP_USER = process.env.SMTP_USER ?? '';

export async function enviarCorreoValidacionEmpresa({
  nombre,
  correo,
  tipoCuenta
}: {
  nombre: string;
  correo: string;
  tipoCuenta: string;
}) {
  try {
    // Crear transporte SMTP (puede ser Gmail, Mailersend, etc.)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // o el host que uses
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const html = plantillaRegistroHTML({ nombre, correo, tipoCuenta });

    // Enviar el correo
    await transporter.sendMail({
      from: `"HoneyLabs Registro" <${SMTP_USER}>`,
      to: EMAIL_ADMIN,
      subject: `📝 Nuevo registro pendiente: ${tipoCuenta} - ${correo}`,
      html,
    });

    return { enviado: true };
  } catch (error) {
    console.error('[ERROR_EMAIL_VALIDACION]', error);
    return { enviado: false, error };
  }
}
