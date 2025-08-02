import { getDb } from '@lib/db'
import type { SupabaseClient } from '@supabase/supabase-js'
import { emitEvent } from '../src/lib/events'

async function run() {
  const db = getDb().client as SupabaseClient
  const { data: materiales, error } = await db
    .from('material')
    .select('id,nombre,almacenId,cantidad,reorderLevel')
    .not('reorderLevel', 'is', null)
  if (error) throw error

  for (const m of materiales) {
    if (m.reorderLevel === null || m.cantidad >= (m.reorderLevel ?? 0)) continue

    const { error: upsertError } = await db
      .from('alerta')
      .upsert(
        {
          materialId: m.id,
          almacenId: m.almacenId,
          mensaje: `Reordenar ${m.nombre}`,
          activa: true,
        },
        { onConflict: 'materialId' }
      )
    if (upsertError) throw upsertError

    emitEvent({ type: 'reorder', payload: { materialId: m.id } })
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
