import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function resolveDatabaseUrl() {
  let url = process.env.DATABASE_URL
  if (!url) return undefined
  const useProxy = process.env.PRISMA_DATA_PROXY?.toLowerCase() === 'true'
  if (useProxy && !url.startsWith('prisma://') && !url.startsWith('prisma+')) {
    if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
      url = `prisma+${url}`
    }
  }
  return url
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: resolveDatabaseUrl() } },
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

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

if (!globalForPrisma.prisma && !process.env.VITEST) {
  prisma.$connect().catch((e) =>
    console.error('Prisma connection error:', e),
  )
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
