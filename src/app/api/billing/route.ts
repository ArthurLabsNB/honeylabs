import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import {
  buildFacturaPdf,
  buildFacturaXml,
  buildFacturaUbl,
  validateCfdi,
} from '@/lib/billing'

export async function GET() {
  const facturas = await prisma.factura.findMany({
    orderBy: { id: 'desc' },
    take: 20,
    include: { cliente: { select: { nombre: true } } },
  })
  return NextResponse.json({ facturas })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = validateCfdi(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid_data' }, { status: 400 })
    }
    const factura = await prisma.factura.create({
      data: {
        folio: parsed.data.folio,
        clienteId: body.clienteId ?? null,
        total: parsed.data.total,
      },
    })
    const pdf = buildFacturaPdf(factura)
    const xml = buildFacturaXml(factura)
    const ubl = buildFacturaUbl(factura)
    return NextResponse.json({ factura, pdf: Boolean(pdf), xml, ublJson: ubl })
  } catch (e) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
