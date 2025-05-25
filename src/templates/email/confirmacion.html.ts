export function plantillaConfirmacionHTML({
  nombre,
  tipoCuenta,
}: {
  nombre: string;
  tipoCuenta: string;
}) {
  const requiereValidacion = ['institucional', 'empresarial'].includes(tipoCuenta.toLowerCase());

  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 1rem; max-width: 600px;">
      <h2 style="color: #a16f3d;">🎉 ¡Gracias por registrarte en <strong>HoneyLabs</strong>, ${nombre}!</h2>

      <p>Hemos recibido tu solicitud para crear una cuenta <strong>${tipoCuenta}</strong>.</p>

      ${
        requiereValidacion
          ? `<p>🔐 Tu cuenta requiere <strong>validación manual</strong> por parte del equipo de HoneyLabs. Serás notificado una vez sea aprobada.</p>`
          : `<p>✅ Tu cuenta está activa y puedes empezar a explorar HoneyLabs cuando gustes.</p>`
      }

      <p style="margin-top: 1.5rem;">
        Si tienes alguna duda, puedes contactar con nosotros desde el área de ayuda o responder este correo.
      </p>

      <hr style="margin: 2rem 0;" />

      <p style="font-size: 0.85rem; color: #777;">
        Este mensaje ha sido enviado automáticamente por la plataforma HoneyLabs. Si tú no solicitaste esta cuenta, puedes ignorar este correo.
      </p>
    </div>
  `;
}
