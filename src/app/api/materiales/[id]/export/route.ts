export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getUsuarioFromSession } from '@lib/auth'
import { hasManagePerms } from '@lib/permisos'
import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import YAML from 'yaml'
import * as logger from '@lib/logger'

function getMaterialId(req: NextRequest): number | null {
  const parts = req.nextUrl.pathname.split('/')
  const idx = parts.findIndex(p => p === 'materiales')
  const id = idx !== -1 && parts.length > idx + 1 ? Number(parts[idx + 1]) : null
  return id && !Number.isNaN(id) ? id : null
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await getUsuarioFromSession(req)
    if (!usuario) return new NextResponse('No autenticado', { status: 401 })
    const id = getMaterialId(req)
    if (!id) return new NextResponse('ID inválido', { status: 400 })
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        archivos: { select: { nombre: true, archivoNombre: true } },
        unidades: { select: { id: true, nombre: true } },
      },
    })
    if (!material) return new NextResponse('No encontrado', { status: 404 })
    const pertenece = await prisma.usuarioAlmacen.findFirst({
      where: { usuarioId: usuario.id, almacenId: material.almacenId },
      select: { id: true },
    })
    if (!pertenece && !hasManagePerms(usuario)) {
      return new NextResponse('Sin permisos', { status: 403 })
    }
    const url = new URL(req.url)
    const format = (url.searchParams.get('format') || 'json').toLowerCase()
    const baseData: any = {
      nombre: material.nombre,
      descripcion: material.descripcion,
      cantidad: material.cantidad,
      unidad: material.unidad,
      lote: material.lote,
      fechaCaducidad: material.fechaCaducidad,
      ubicacion: material.ubicacion,
      proveedor: material.proveedor,
      estado: material.estado,
      observaciones: material.observaciones,
      archivos: material.archivos.map(a => a.nombre),
      unidades: material.unidades.map(u => u.nombre),
    }

    if (format === 'pdf') {
      const doc = new PDFDocument()
      const chunks: Buffer[] = []
      doc.fontSize(16).text(`Material: ${material.nombre}`)
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
          'Content-Disposition': `attachment; filename=material_${id}.pdf`,
        },
      })
    }

    if (format === 'excel') {
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet('Material')
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
          'Content-Disposition': `attachment; filename=material_${id}.xlsx`,
        },
      })
    }

    if (format === 'image') {
      if (!material.miniatura) return new NextResponse('Sin miniatura', { status: 404 })
      const buf = Buffer.isBuffer(material.miniatura) ? material.miniatura : Buffer.from(material.miniatura)
      return new NextResponse(buf, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename=material_${id}.png`,
        },
      })
    }

    if (format === 'csv') {
      const csv = Object.entries(baseData)
        .filter(([, v]) => !Array.isArray(v))
        .map(([k, v]) => `${k},"${String(v ?? '').replace(/"/g, '""')}"`)
        .join('\n')
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=material_${id}.csv`,
        },
      })
    }

    if (format === 'xml') {
      const xml = `<material>` +
        Object.entries(baseData)
          .filter(([, v]) => !Array.isArray(v))
          .map(([k, v]) => `<${k}>${v ?? ''}</${k}>`).join('') +
        `</material>`
      return new NextResponse(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Content-Disposition': `attachment; filename=material_${id}.xml`,
        },
      })
    }

    if (format === 'yaml') {
      const yaml = YAML.stringify(baseData)
      return new NextResponse(yaml, {
        status: 200,
        headers: {
          'Content-Type': 'text/yaml',
          'Content-Disposition': `attachment; filename=material_${id}.yaml`,
        },
      })
    }

    // json por defecto
    return NextResponse.json(baseData)
  } catch (err) {
    logger.error('GET /api/materiales/[id]/export', err)
    return new NextResponse('Error', { status: 500 })
  }
}
