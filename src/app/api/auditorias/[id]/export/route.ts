export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/db/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import JSZip from 'jszip'
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
        archivos: { select: { nombre: true, archivo: true, archivoNombre: true } },
      },
    })
    if (!auditoria) return new NextResponse('No encontrado', { status: 404 })
    const url = new URL(req.url)
    const format = (url.searchParams.get('format') || 'json').toLowerCase()
    const includeFiles = url.searchParams.get('files') === '1'
    let observaciones: any = auditoria.observaciones
    if (observaciones) {
      try { observaciones = JSON.parse(observaciones) } catch {}
    }

    let snapshot: any = null
    if (auditoria.tipo === 'almacen' && auditoria.almacenId) {
      const hist = await prisma.historialAlmacen.findFirst({
        where: { almacenId: auditoria.almacenId, fecha: { lte: auditoria.fecha } },
        orderBy: { fecha: 'desc' },
        select: { estado: true },
      })
      snapshot = hist?.estado ?? null
    }
    if (auditoria.tipo === 'material' && auditoria.materialId) {
      const hist = await prisma.historialLote.findFirst({
        where: { materialId: auditoria.materialId, fecha: { lte: auditoria.fecha } },
        orderBy: { fecha: 'desc' },
        select: { estado: true },
      })
      snapshot = hist?.estado ?? null
    }
    if (auditoria.tipo === 'unidad' && auditoria.unidadId) {
      const hist = await prisma.historialUnidad.findFirst({
        where: { unidadId: auditoria.unidadId, fecha: { lte: auditoria.fecha } },
        orderBy: { fecha: 'desc' },
        select: { estado: true },
      })
      snapshot = hist?.estado ?? null
    }

    const baseData: any = {
      tipo: auditoria.tipo,
      version: auditoria.version ?? 1,
      categoria: auditoria.categoria,
      fecha: auditoria.fecha,
      observaciones,
      snapshot,
      usuario: auditoria.usuario?.nombre,
      almacen: auditoria.almacen?.nombre,
      material: auditoria.material?.nombre,
      unidad: auditoria.unidad?.nombre,
      archivos: auditoria.archivos.map(a => a.nombre),
    }

    const formatValue = (v: any) => {
      if (Array.isArray(v)) return v.join(', ')
      if (v && typeof v === 'object') return JSON.stringify(v)
      return v
    }

    let dataBuffer: Buffer | string | null = null
    let contentType = ''
    const ext = format === 'excel' ? 'xlsx' : format

    if (format === 'pdf') {
      const doc = new PDFDocument()
      const chunks: Buffer[] = []
      doc.fontSize(16).text(`Auditor\xeda ${id}`)
      doc.moveDown()
      Object.entries(baseData).forEach(([k, v]) => {
        const val = formatValue(v)
        if (val != null) doc.fontSize(12).text(`${k}: ${String(val)}`)
      })
      doc.end()
      for await (const c of doc) chunks.push(c as Buffer)
      dataBuffer = Buffer.concat(chunks)
      contentType = 'application/pdf'
    } else if (format === 'excel') {
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet('Auditoria')
      ws.addRow(['Campo', 'Valor'])
      Object.entries(baseData).forEach(([k, v]) => {
        ws.addRow([k, formatValue(v) as any])
      })
      dataBuffer = await wb.xlsx.writeBuffer()
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } else if (format === 'csv') {
      const csv = Object.entries(baseData)
        .map(([k, v]) => `${k},"${String(formatValue(v) ?? '').replace(/"/g, '""')}"`)
        .join('\n')
      dataBuffer = csv
      contentType = 'text/csv'
    } else {
      return NextResponse.json(baseData)
    }

    if (includeFiles && auditoria.archivos.length > 0) {
      const zip = new JSZip()
      const buf = typeof dataBuffer === 'string' ? Buffer.from(dataBuffer) : dataBuffer
      zip.file(`auditoria_${id}.${ext}`, buf)
      auditoria.archivos.forEach(a => {
        if (a.archivo) zip.file(a.archivoNombre || a.nombre, Buffer.from(a.archivo as Buffer))
      })
      const zipBuf = await zip.generateAsync({ type: 'nodebuffer' })
      return new NextResponse(zipBuf, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename=auditoria_${id}.zip`,
        },
      })
    }

    return new NextResponse(typeof dataBuffer === 'string' ? dataBuffer : dataBuffer as Buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename=auditoria_${id}.${ext}`,
      },
    })
  } catch (err) {
    logger.error('GET /api/auditorias/[id]/export', err)
    return new NextResponse('Error', { status: 500 })
  }
}
