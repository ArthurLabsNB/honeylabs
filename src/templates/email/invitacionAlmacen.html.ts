export function plantillaInvitacionAlmacenHTML({ enlace }: { enlace: string }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 1rem; max-width: 600px;">
      <h2 style="color: #a16f3d;">🔗 Invitación a colaborar en <strong>HoneyLabs</strong></h2>
      <p>Haz clic en el siguiente enlace para acceder al almacén compartido:</p>
      <p>
        <a href="${enlace}" style="display:inline-block;padding:8px 16px;background:#a16f3d;color:#fff;text-decoration:none;border-radius:4px;">Abrir invitación</a>
      </p>
      <p style="font-size:0.9rem;color:#777;">Si no esperabas esta invitación puedes ignorar este mensaje.</p>
    </div>
  `;
}
