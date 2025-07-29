import { z } from 'zod'

export const auditoriaSchema = z.object({
  tipo: z.enum(['almacen', 'material', 'unidad']),
  objetoId: z.coerce.number().int().positive(),
  categoria: z.string().min(1),
  observaciones: z.string().min(1),
})

export type AuditoriaInput = z.infer<typeof auditoriaSchema>
