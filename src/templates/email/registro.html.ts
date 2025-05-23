export function plantillaRegistroHTML({ nombre, correo, tipoCuenta }: {
  nombre: string;
  correo: string;
  tipoCuenta: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 1rem;">
      <h2>🐝 Nueva solicitud de cuenta en HoneyLabs</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Tipo de cuenta:</strong> ${tipoCuenta}</p>
      <hr/>
      <p>Esta cuenta ha sido registrada como <strong>${tipoCuenta}</strong>. Debe ser validada manualmente antes de activarse.</p>
      <p>Por favor, revisa el archivo de validación si fue adjuntado y toma acción desde el panel de administración.</p>
    </div>
  `;
}
