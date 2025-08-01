import { warn } from './logger'

const BASE_REQUIRED = ['JWT_SECRET', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'] as const
const SUPABASE_REQUIRED = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const
const PRISMA_REQUIRED = ['DATABASE_URL'] as const

export default function validateEnv() {
  const required: string[] = [...BASE_REQUIRED]
  if (process.env.DB_PROVIDER === 'supabase') {
    required.push(...SUPABASE_REQUIRED)
  } else if (process.env.DB_PROVIDER === 'prisma') {
    required.push(...PRISMA_REQUIRED)
  }
  const missing = required.filter((key) => !process.env[key])
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

