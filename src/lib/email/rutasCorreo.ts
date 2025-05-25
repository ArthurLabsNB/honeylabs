// 📦 Módulo de rutas inteligentes para correo según tipo de cuenta

/**
 * Devuelve el correo destino correspondiente al tipo de cuenta
 * @param tipoCuenta - Tipo de cuenta: 'estandar', 'empresarial', 'institucional'
 * @returns Correo destino como string
 */
export function getCorreoDestino(tipoCuenta: string): string {
  const EMAIL_ESTANDAR = process.env.EMAIL_DESTINO_ESTANDAR;
  const EMAIL_VALIDACION = process.env.EMAIL_DESTINO_VALIDACION;
  const EMAIL_ADMIN = process.env.EMAIL_ADMIN;

  // 🚨 Validación de entorno en tiempo de ejecución
  if (!EMAIL_ESTANDAR || !EMAIL_VALIDACION || !EMAIL_ADMIN) {
    throw new Error('❌ Faltan variables de entorno para el enrutamiento de correos (EMAIL_DESTINO_*, EMAIL_ADMIN)');
  }

  switch (tipoCuenta.toLowerCase()) {
    case 'empresarial':
    case 'institucional':
      return EMAIL_VALIDACION;
    case 'estandar':
      return EMAIL_ESTANDAR;
    default:
      console.warn(`⚠️ Tipo de cuenta desconocido: "${tipoCuenta}". Usando EMAIL_ADMIN como respaldo.`);
      return EMAIL_ADMIN;
  }
}
