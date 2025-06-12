"use client"
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'

interface Row { [key: string]: any }
const campos = ['nombre','descripcion','unidad','cantidad']

export default function ArchivosPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [history, setHistory] = useState<Row[][]>([])
  const [historyIdx, setHistoryIdx] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const onDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    const reader = new FileReader()
    reader.onload = async e => {
      try {
        let data: Row[] = []
        if (ext === 'csv' || ext === 'tsv') {
          const text = e.target?.result as string
          const parsed = Papa.parse<Row>(text, { header: true, delimiter: ext === 'tsv' ? '\t' : ',' })
          data = parsed.data
        } else if (ext === 'xlsx' || ext === 'xls' || ext === 'ods') {
          const ab = e.target?.result as ArrayBuffer
          const wb = XLSX.read(ab, { type: 'array' })
          const sheet = wb.SheetNames[0]
          data = XLSX.utils.sheet_to_json<Row>(wb.Sheets[sheet])
        } else if (ext === 'json') {
          data = JSON.parse(e.target?.result as string)
        } else if (ext === 'zip') {
          const zip = await JSZip.loadAsync(e.target?.result as ArrayBuffer)
          const name = Object.keys(zip.files)[0]
          const text = await zip.files[name].async('string')
          const parsed = Papa.parse<Row>(text, { header: true })
          data = parsed.data
        }
        const cols = data.length > 0 ? Object.keys(data[0]) : []
        setRows(data)
        setColumns(cols)
        setHistory([data])
        setHistoryIdx(0)
        setLog(l => [...l, `Cargado ${data.length} filas.`])
      } catch {
        setLog(l => [...l, 'Error al leer archivo'])
      }
    }
    if (ext === 'xlsx' || ext === 'xls' || ext === 'ods' || ext === 'zip') reader.readAsArrayBuffer(file)
    else reader.readAsText(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const undo = () => {
    if (historyIdx > 0) {
      setRows(history[historyIdx - 1])
      setHistoryIdx(historyIdx - 1)
    }
  }
  const redo = () => {
    if (historyIdx < history.length - 1) {
      setRows(history[historyIdx + 1])
      setHistoryIdx(historyIdx + 1)
    }
  }
  const updateCell = (i: number, key: string, value: string) => {
    setRows(r => {
      const newRows = r.map((row, idx) => (idx === i ? { ...row, [key]: value } : row))
      const h = history.slice(0, historyIdx + 1)
      h.push(newRows)
      setHistory(h)
      setHistoryIdx(h.length - 1)
      return newRows
    })
  }

  const enviar = async () => {
    await fetch('/api/archivos/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'material', registros: rows }),
    })
    setLog(l => [...l, 'Datos enviados al servidor.'])
  }

  const exportar = async (formato: string) => {
    const res = await fetch(`/api/archivos/export?tipo=material&formato=${formato}`)
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `export.${formato}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Archivos</h1>
      <div
        {...getRootProps()}
        className="border-dashed border rounded p-6 mb-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? 'Suelta el archivo...' : 'Arrastra o haz clic para seleccionar un archivo'}
      </div>
      {columns.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {columns.map(c => (
                  <th key={c} className="border px-2 py-1">
                    <select className="bg-transparent" defaultValue={c}>
                      {[c, ...campos.filter(f => f !== c)].map(v => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={col} className="border px-2 py-1">
                      <input
                        className="w-full bg-transparent"
                        value={row[col] ?? ''}
                        onChange={e => updateCell(i, col, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <button onClick={undo} className="px-3 py-1 border rounded">
          Deshacer
        </button>
        <button onClick={redo} className="px-3 py-1 border rounded">
          Rehacer
        </button>
        <button
          onClick={enviar}
          className="px-3 py-1 border rounded bg-blue-500 text-white"
        >
          Importar
        </button>
        <button onClick={() => exportar('csv')} className="px-3 py-1 border rounded">
          Exportar CSV
        </button>
        <button onClick={() => exportar('json')} className="px-3 py-1 border rounded">
          Exportar JSON
        </button>
      </div>
      <div className="mt-4">
        <h2 className="font-bold mb-2">Historial</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
