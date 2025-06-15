import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

export function buildMaterialPdf(data: Record<string, any>): Blob {
  const doc = new jsPDF()
  doc.text(`Material: ${data.nombre}`, 10, 10)
  let y = 20
  Object.entries(data).forEach(([k, v]) => {
    if (k === 'nombre') return
    doc.text(`${k}: ${String(v ?? '')}`, 10, y)
    y += 10
  })
  return doc.output('blob')
}

export function buildMaterialExcel(data: Record<string, any>): Blob {
  const wsData = Object.entries(data).map(([k, v]) => [k, v])
  const ws = XLSX.utils.aoa_to_sheet([['Campo', 'Valor'], ...wsData])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Material')
  const ab = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}
