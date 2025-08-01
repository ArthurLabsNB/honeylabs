export type DbTransaction = unknown

export interface DbClient {
  readonly client: unknown
  transaction<T>(fn: (tx: DbTransaction) => Promise<T>): Promise<T>
}

let dbClient: DbClient

if (process.env.DB_PROVIDER === 'prisma') {
  const { PrismaAdapter } = await import('./prisma')
  dbClient = PrismaAdapter
} else {
  const { SupabaseAdapter } = await import('./supabase')
  dbClient = SupabaseAdapter
}

export function getDb(): DbClient {
  return dbClient
}
