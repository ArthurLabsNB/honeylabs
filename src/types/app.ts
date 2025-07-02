import { z } from 'zod'

export const appInfoSchema = z.object({
  version: z.string(),
  url: z.string(),
  sha256: z.string(),
  building: z.boolean().default(false),
  progress: z.number().min(0).max(1).default(0),
})

export type AppInfo = z.infer<typeof appInfoSchema>
