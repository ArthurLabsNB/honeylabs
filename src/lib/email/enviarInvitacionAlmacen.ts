import nodemailer from 'nodemailer';
import { plantillaInvitacionAlmacenHTML } from '@/templates/email/invitacionAlmacen.html';
import * as logger from '@lib/logger';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_USER || !SMTP_PASS) {
  throw new Error('SMTP_USER o SMTP_PASS faltantes');
}

export async function enviarInvitacionAlmacen({
  correos,
  enlace,
}: {
  correos: string[];
  enlace: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const html = plantillaInvitacionAlmacenHTML({ enlace });
    const info = await transporter.sendMail({
      from: `"HoneyLabs" <${SMTP_USER}>`,
      to: correos.join(', '),
      subject: 'Invitación a almacén',
      html,
    });

    logger.info('[EMAIL_INVITACION_ENVIADO]', info.messageId);
    return { enviado: true };
  } catch (error: any) {
    logger.error('[ERROR_EMAIL_INVITACION]', error);
    return { enviado: false, error: error.message };
  }
}
