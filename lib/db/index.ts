import { PrismaAdapter } from './prisma'
import { SupabaseAdapter } from './supabase'

export type DbTransaction = unknown

export interface DbClient {
  readonly client: unknown
  transaction<T>(fn: (tx: DbTransaction) => Promise<T>): Promise<T>
}

export function getDb(): DbClient {
  return process.env.DB_PROVIDER === 'supabase'
    ? SupabaseAdapter
    : PrismaAdapter
}

export { PrismaAdapter, SupabaseAdapter }
