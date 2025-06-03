import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
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
