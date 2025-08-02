import { warn } from './logger'

const BASE_REQUIRED = [
  'DB_PROVIDER',
  'JWT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'EMAIL_ADMIN',
  'EMAIL_DESTINO_ESTANDAR',
  'EMAIL_DESTINO_VALIDACION',
  'SMTP_USER',
  'SMTP_PASS',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
] as const

const SUPABASE_REQUIRED = [
  'DATABASE_URL',
  'DIRECT_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_JWT_SECRET',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'POSTGRES_PASSWORD',
  'POSTGRES_USER',
  'POSTGRES_HOST',
  'POSTGRES_DATABASE',
] as const

const PRISMA_REQUIRED = [
  'DATABASE_URL',
  'DIRECT_DB_URL',
] as const

const OBSOLETE_KEYS = [
  'honeylab_DATABASE_URL',
  'honeylab_PRISMA_DATABASE_URL',
  'honeylab_POSTGRES_URL',
] as const

export default function validateEnv() {
  const mode = process.env.DB_PROVIDER

  if (!mode) throw new Error('❌ Faltante: DB_PROVIDER en .env')

  const required = [...BASE_REQUIRED]

  if (mode === 'supabase') {
    required.push(...SUPABASE_REQUIRED)
  } else if (mode === 'prisma') {
    required.push(...PRISMA_REQUIRED)
  } else {
    warn(`⚠️ DB_PROVIDER desconocido: "${mode}". No se aplicó validación específica.`)
  }

  const missing = required.filter((key) => !process.env[key])
  const foundObsolete = OBSOLETE_KEYS.filter((key) => !!process.env[key])

  if (missing.length > 0) {
    const msg = `❌ Faltan variables en .env:\n${missing.map(k => `- ${k}`).join('\n')}`
    const shouldThrow =
      process.env.NODE_ENV === 'production' &&
      process.env.SKIP_ENV_CHECK !== 'true' &&
      !process.env.VITEST
    if (shouldThrow) throw new Error(msg)
    warn(msg)
  }

  if (foundObsolete.length > 0) {
    warn(`🧹 Variables obsoletas detectadas (elimina si no las usas):\n${foundObsolete.map(k => `- ${k}`).join('\n')}`)
  }
}
