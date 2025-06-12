export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import * as logger from '@lib/logger'
import { unparse } from 'papaparse'

export async function GET(req: NextRequest) {
  try {
    const tipo = req.nextUrl.searchParams.get('tipo') ?? 'material'
    let data: any[] = []
    if (tipo === 'almacen') {
      data = await prisma.almacen.findMany({ take: 100 })
    } else if (tipo === 'unidad') {
      data = await prisma.materialUnidad.findMany({ take: 100 })
    } else {
      data = await prisma.material.findMany({ take: 100 })
    }
    const formato = req.nextUrl.searchParams.get('formato') ?? 'json'
    if (formato === 'csv' || formato === 'tsv') {
      const csv = unparse(data, { delimiter: formato === 'csv' ? ',' : '\t' })
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=${tipo}.${formato}`,
        },
      })
    }
    return NextResponse.json({ registros: data })
  } catch (err) {
    logger.error('GET /api/archivos/export', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
