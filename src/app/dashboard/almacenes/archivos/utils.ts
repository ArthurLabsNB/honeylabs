"use client"

import Papa, { unparse } from 'papaparse'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'

export type Row = Record<string, any>

export const getFileExt = (name: string): string => name.split('.').pop()?.toLowerCase() ?? ''

export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })

export const parseCSV = (text: string, delimiter = ','): Row[] =>
  Papa.parse<Row>(text, { header: true, delimiter }).data

export const parseSpreadsheet = (ab: ArrayBuffer): Row[] => {
  const wb = XLSX.read(ab, { type: 'array' })
  const sheet = wb.SheetNames[0]
  return XLSX.utils.sheet_to_json<Row>(wb.Sheets[sheet])
}

export const parseJSONData = (text: string): Row[] => JSON.parse(text)

export const parseZIP = async (ab: ArrayBuffer): Promise<Row[]> => {
  const zip = await JSZip.loadAsync(ab)
  const name = Object.keys(zip.files)[0]
  const text = await zip.files[name].async('string')
  return parseCSV(text)
}

export const detectColumns = (rows: Row[]): string[] =>
  rows.length > 0 ? Object.keys(rows[0]) : []

export const createHistoryEntry = (history: Row[][], entry: Row[]): Row[][] => [...history, entry]

export const undoHistory = (history: Row[][], idx: number) =>
  idx > 0 ? { rows: history[idx - 1], idx: idx - 1 } : { rows: history[0] ?? [], idx }

export const redoHistory = (history: Row[][], idx: number) =>
  idx < history.length - 1 ? { rows: history[idx + 1], idx: idx + 1 } : { rows: history[idx] ?? [], idx }

export const buildJSONBlob = (rows: Row[]): Blob =>
  new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })

export const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const fetchExport = async (tipo: string, formato: string): Promise<Blob> => {
  const res = await fetch(`/api/archivos/export?tipo=${tipo}&formato=${formato}`)
  if (!res.ok) throw new Error('Export failed')
  return res.blob()
}

export const postImport = async (tipo: string, registros: Row[]) =>
  fetch('/api/archivos/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, registros }),
  })

