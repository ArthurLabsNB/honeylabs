export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import * as logger from '@lib/logger'

function getAuditoriaId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'auditorias')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return new NextResponse('No autenticado', { status: 401 })
    const id = getAuditoriaId(req)
    if (!id) return new NextResponse('ID inválido', { status: 400 })
    const auditoria = await prisma.auditoria.findUnique({
      where: { id },
      include: {
        usuario: { select: { nombre: true } },
        almacen: { select: { nombre: true } },
        material: { select: { nombre: true } },
        unidad: { select: { nombre: true } },
        archivos: { select: { nombre: true } },
      },
    })
    if (!auditoria) return new NextResponse('No encontrado', { status: 404 })
    const url = new URL(req.url)
    const format = (url.searchParams.get('format') || 'json').toLowerCase()
    const baseData: any = {
      tipo: auditoria.tipo,
      version: auditoria.version,
      categoria: auditoria.categoria,
      fecha: auditoria.fecha,
      observaciones: auditoria.observaciones,
      usuario: auditoria.usuario?.nombre,
      almacen: auditoria.almacen?.nombre,
      material: auditoria.material?.nombre,
      unidad: auditoria.unidad?.nombre,
      archivos: auditoria.archivos.map(a => a.nombre),
    }

    if (format === 'pdf') {
      const doc = new PDFDocument()
      const chunks: Buffer[] = []
      doc.fontSize(16).text(`Auditor\xeda ${id}`)
      doc.moveDown()
      Object.entries(baseData).forEach(([k, v]) => {
        if (Array.isArray(v)) return
        if (v != null) doc.fontSize(12).text(`${k}: ${String(v)}`)
      })
      doc.end()
      for await (const c of doc) chunks.push(c as Buffer)
      const buffer = Buffer.concat(chunks)
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=auditoria_${id}.pdf`,
        },
      })
    }

    if (format === 'excel') {
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet('Auditoria')
      ws.addRow(['Campo', 'Valor'])
      Object.entries(baseData).forEach(([k, v]) => {
        if (Array.isArray(v)) return
        ws.addRow([k, v as any])
      })
      const buffer = await wb.xlsx.writeBuffer()
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename=auditoria_${id}.xlsx`,
        },
      })
    }

    if (format === 'csv') {
      const csv = Object.entries(baseData)
        .filter(([, v]) => !Array.isArray(v))
        .map(([k, v]) => `${k},"${String(v ?? '').replace(/\"/g, '""')}"`)
        .join('\n')
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=auditoria_${id}.csv`,
        },
      })
    }

    // json por defecto
    return NextResponse.json(baseData)
  } catch (err) {
    logger.error('GET /api/auditorias/[id]/export', err)
    return new NextResponse('Error', { status: 500 })
  }
}
