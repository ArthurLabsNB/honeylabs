process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db'
process.env.EMAIL_ADMIN = 'admin@example.com'
process.env.SMTP_USER = 'user'
process.env.SMTP_PASS = 'pass'

process.env.VITEST = 'true'

import { vi } from 'vitest'

class PrismaClient {
  usuario = {
    findMany: () => Promise.resolve(),
    update: () => Promise.resolve(),
    findUnique: () => Promise.resolve(),
  }
  usuarioAlmacen = {
    findFirst: () => Promise.resolve(),
    upsert: () => Promise.resolve(),
    findMany: () => Promise.resolve(),
    delete: () => Promise.resolve(),
  }
  almacen = {
    findMany: () => Promise.resolve(),
  }
  codigoAlmacen = {
    findUnique: () => Promise.resolve(),
    update: () => Promise.resolve(),
    create: () => Promise.resolve(),
  }
  material = {
    findMany: () => Promise.resolve(),
  }
  nota = {
    findMany: () => Promise.resolve(),
    create: () => Promise.resolve(),
    update: () => Promise.resolve(),
    delete: () => Promise.resolve(),
  }
  $transaction = (cb: any) => cb(this)
  $executeRawUnsafe = () => Promise.resolve()
  $use() {}
  $connect() {}
}

vi.mock('@prisma/client', () => ({ PrismaClient }))
