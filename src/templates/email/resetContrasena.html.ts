export function plantillaResetContrasenaHTML({ nombre, enlace }: { nombre: string; enlace: string; }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 1rem; max-width: 600px;">
      <h2 style="color: #a16f3d;">🔐 Recuperar contraseña</h2>
      <p>Hola ${nombre}, has solicitado restablecer tu contraseña.</p>
      <p>
        <a href="${enlace}" style="display:inline-block;padding:8px 16px;background:#a16f3d;color:#fff;text-decoration:none;border-radius:4px;">Restablecer contraseña</a>
      </p>
      <p>Si no realizaste esta solicitud, ignora este mensaje.</p>
    </div>
  `;
}
