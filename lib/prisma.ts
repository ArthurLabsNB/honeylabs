import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export function resolveDatabaseUrl() {
  let url = process.env.DATABASE_URL
  if (!url) return undefined

  if (url.startsWith('postgres://')) {
    url = url.replace('postgres://', 'postgresql://')
  }

  const useProxy = process.env.PRISMA_DATA_PROXY?.toLowerCase() === 'true'
  if (useProxy && !url.startsWith('prisma://') && !url.startsWith('prisma+')) {
    if (url.startsWith('postgresql://')) {
      url = `prisma+${url}`
    }
  }

  return url
}

const dbUrl = resolveDatabaseUrl()
const logLevel =
  process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error']

const options = dbUrl ? { datasources: { db: { url: dbUrl } }, log: logLevel } : { log: logLevel }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(options)

prisma.$use(async (params, next) => {
  if (
    params.model === 'Material' &&
    ['create', 'update', 'updateMany'].includes(params.action)
  ) {
    const data = params.args.data
    if (typeof data?.cantidad === 'number' && data.cantidad < 0) {
      throw new Error('Cantidad negativa no permitida')
    }
    if (typeof data?.reorderLevel === 'number' && data.reorderLevel < 0) {
      throw new Error('reorderLevel negativo no permitido')
    }
  }
  return next(params)
})

if (dbUrl && !globalForPrisma.prisma && !process.env.VITEST) {
  prisma.$connect().catch((e) =>
    console.error('Prisma connection error:', e),
  )
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
