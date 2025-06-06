export function plantillaRegistroHTML({
  nombre,
  correo,
  tipoCuenta,
}: {
  nombre: string;
  correo: string;
  tipoCuenta: string;
}) {
  const requiereValidacion = ['institucional', 'empresarial'].includes(tipoCuenta.toLowerCase());

  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 1rem; max-width: 600px;">
      <h2 style="color: #a16f3d;">🐝 Nueva solicitud de cuenta en <strong>HoneyLabs</strong></h2>

      <p><strong>📛 Nombre:</strong> ${nombre}</p>
      <p><strong>📧 Correo:</strong> ${correo}</p>
      <p><strong>🏷️ Tipo de cuenta:</strong> ${tipoCuenta.charAt(0).toUpperCase() + tipoCuenta.slice(1)}</p>

      <hr style="margin: 1rem 0;" />

      ${
        requiereValidacion
          ? `<p>🔐 Esta cuenta requiere <strong>validación manual</strong> por el equipo de HoneyLabs antes de activarse.</p>
             <p>📁 Si se adjuntó un archivo de validación, revísalo desde el panel administrativo.</p>`
          : `<p>✅ Esta cuenta fue registrada correctamente y puede comenzar a utilizar HoneyLabs.</p>`
      }

      <p style="margin-top: 2rem; font-size: 0.9rem; color: #777;">
        Si este correo llegó por error o no reconoces esta solicitud, puedes ignorarlo de forma segura.
      </p>
    </div>
  `;
}
