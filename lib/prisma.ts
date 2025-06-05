import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function resolveDatabaseUrl() {
  let url = process.env.DATABASE_URL
  if (!url) return undefined
  if (!url.startsWith('prisma://') && !url.startsWith('prisma+')) {
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

if (!globalForPrisma.prisma) {
  prisma.$connect().catch((e) =>
    console.error('Prisma connection error:', e),
  )
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
