import { warn } from './logger'

const REQUIRED = ['JWT_SECRET', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'] as const

export default function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key])
  if (!missing.length) return
  const message = `Faltan variables de entorno: ${missing.join(', ')}`
  const shouldThrow =
    process.env.NODE_ENV === 'production' &&
    process.env.SKIP_ENV_CHECK !== 'true' &&
    !process.env.VITEST
  if (shouldThrow) {
    throw new Error(message)
  }
  warn(message)
}

