// 📦 Módulo de rutas inteligentes para correo según tipo de cuenta

/**
 * Devuelve el correo destino correspondiente al tipo de cuenta.
 * Rutas definidas por variables de entorno:
 * - EMAIL_DESTINO_ESTANDAR
 * - EMAIL_DESTINO_VALIDACION
 * - EMAIL_ADMIN (respaldo)
 *
 * @param tipoCuenta - 'individual', 'empresarial', 'institucional', 'codigo', 'administrador'
 * @returns Dirección de correo destino como string
 */
export function getCorreoDestino(tipoCuenta: string): string {
  const EMAIL_ESTANDAR = process.env.EMAIL_DESTINO_ESTANDAR;
  const EMAIL_VALIDACION = process.env.EMAIL_DESTINO_VALIDACION;
  const EMAIL_ADMIN = process.env.EMAIL_ADMIN;

  // 🚨 Validación por variable ausente
  if (!EMAIL_ESTANDAR) {
    console.error('❌ Falta EMAIL_DESTINO_ESTANDAR en el entorno.');
  }
  if (!EMAIL_VALIDACION) {
    console.error('❌ Falta EMAIL_DESTINO_VALIDACION en el entorno.');
  }
  if (!EMAIL_ADMIN) {
    console.error('❌ Falta EMAIL_ADMIN en el entorno.');
  }

  if (!EMAIL_ESTANDAR || !EMAIL_VALIDACION || !EMAIL_ADMIN) {
    throw new Error('❌ Faltan variables de entorno requeridas para enrutar correos.');
  }

  switch (tipoCuenta.toLowerCase()) {
    case 'empresarial':
    case 'institucional':
      return EMAIL_VALIDACION;
    case 'individual':
      return EMAIL_ESTANDAR;
    default:
      console.warn(`⚠️ Tipo de cuenta desconocido: "${tipoCuenta}". Usando EMAIL_ADMIN como respaldo.`);
      return EMAIL_ADMIN;
  }
}
