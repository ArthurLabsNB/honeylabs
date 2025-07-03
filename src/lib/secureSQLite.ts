import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin'

const sqlite = new SQLiteConnection(CapacitorSQLite)

export async function openEncryptedDB(name: string) {
  let key = await SecureStoragePlugin.get({ key: 'db-key' }).catch(async () => {
    const val = Math.random().toString(36).slice(2)
    await SecureStoragePlugin.set({ key: 'db-key', value: val })
    return { value: val }
  })
  const db = await sqlite.createConnection(name, false, 'encryption', 1, key.value)
  await db.open()
  return db
}
