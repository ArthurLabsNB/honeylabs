import { z } from 'zod'

export const materialSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  cantidad: z.coerce.number().int().nonnegative(),
  unidad: z.string().optional().nullable(),
  lote: z.string().optional().nullable(),
  fechaCaducidad: z.coerce.date().optional().nullable(),
  ubicacion: z.string().optional().nullable(),
  proveedor: z.string().optional().nullable(),
  estado: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
  minimo: z.coerce.number().int().nonnegative().optional().nullable(),
  maximo: z.coerce.number().int().nonnegative().optional().nullable(),
  codigoBarra: z.string().optional().nullable(),
  codigoQR: z.string().optional().nullable(),
  miniaturaNombre: z.string().optional().nullable(),
  reorderLevel: z.coerce.number().int().nonnegative().optional().nullable(),
})

export type MaterialInput = z.infer<typeof materialSchema>
