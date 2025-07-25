import { jsPDF } from 'jspdf'
import { XMLBuilder } from 'fast-xml-parser'
import { z } from 'zod'

const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i

export const facturaSchema = z.object({
  folio: z.string(),
  clienteRfc: z.string().regex(rfcRegex),
  total: z.number().positive(),
})
export type FacturaInput = z.infer<typeof facturaSchema>

export function validateCfdi(data: unknown) {
  return facturaSchema.safeParse(data)
}

export function buildFacturaPdf(data: Record<string, any>): Blob {
  const doc = new jsPDF()
  doc.text(`Factura: ${data.folio}`, 10, 10)
  doc.text(`Total: ${data.total}`, 10, 20)
  return doc.output('blob')
}

export function buildFacturaXml(data: Record<string, any>): string {
  const builder = new XMLBuilder({ ignoreAttributes: false })
  return builder.build({ factura: data })
}

export function buildFacturaUbl(data: Record<string, any>): string {
  return JSON.stringify({ Invoice: data })
}

export async function pagarConStripe(monto: number) {
  return { id: 'stripe_123', monto }
}

export async function pagarConPaypal(monto: number) {
  return { id: 'paypal_123', monto }
}
