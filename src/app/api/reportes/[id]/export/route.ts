export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import * as logger from '@lib/logger'

function getReporteId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'reportes')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return new NextResponse('No autenticado', { status: 401 })
    const id = getReporteId(req)
    if (!id) return new NextResponse('ID inválido', { status: 400 })
    const reporte = await prisma.reporte.findUnique({
      where: { id },
      include: { usuario: { select: { nombre: true } } }
    })
    if (!reporte) return new NextResponse('No encontrado', { status: 404 })
    const url = new URL(req.url)
    const format = (url.searchParams.get('format') || 'json').toLowerCase()
    const baseData: any = {
      tipo: reporte.tipo,
      categoria: reporte.categoria,
      observaciones: reporte.observaciones,
      fecha: reporte.fecha,
      usuario: reporte.usuario?.nombre
    }
    if (format === 'pdf') {
      const doc = new PDFDocument()
      const chunks: Buffer[] = []
      doc.fontSize(16).text(`Reporte ${id}`)
      doc.moveDown()
      Object.entries(baseData).forEach(([k, v]) => {
        if (v != null) doc.fontSize(12).text(`${k}: ${String(v)}`)
      })
      doc.end()
      for await (const c of doc) chunks.push(c as Buffer)
      const buffer = Buffer.concat(chunks)
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=reporte_${id}.pdf`
        }
      })
    }
    if (format === 'excel') {
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet('Reporte')
      ws.addRow(['Campo', 'Valor'])
      Object.entries(baseData).forEach(([k, v]) => ws.addRow([k, v as any]))
      const buffer = await wb.xlsx.writeBuffer()
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename=reporte_${id}.xlsx`
        }
      })
    }
    if (format === 'xml') {
      const xml = `<reporte>` +
        Object.entries(baseData).map(([k,v]) => `<${k}>${v ?? ''}</${k}>`).join('') +
        `</reporte>`
      return new NextResponse(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Content-Disposition': `attachment; filename=reporte_${id}.xml`
        }
      })
    }
    return NextResponse.json(baseData)
  } catch (err) {
    logger.error('GET /api/reportes/[id]/export', err)
    return new NextResponse('Error', { status: 500 })
  }
}
