"use client"
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  getFileExt,
  readFileAsArrayBuffer,
  readFileAsText,
  parseCSV,
  parseSpreadsheet,
  parseJSONData,
  parseZIP,
  detectColumns,
  createHistoryEntry,
  undoHistory,
  redoHistory,
  triggerDownload,
  fetchExport,
  postImport,
  Row,
} from './utils'

const campos = ['nombre', 'descripcion', 'unidad', 'cantidad']

export default function ArchivosPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [history, setHistory] = useState<Row[][]>([])
  const [historyIdx, setHistoryIdx] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0]
      if (!file) return
      const ext = getFileExt(file.name)
      try {
        let data: Row[] = []
        if (ext === 'csv') data = parseCSV(await readFileAsText(file))
        else if (ext === 'tsv') data = parseCSV(await readFileAsText(file), '\t')
        else if (['xlsx', 'xls', 'ods'].includes(ext)) data = parseSpreadsheet(await readFileAsArrayBuffer(file))
        else if (ext === 'json') data = parseJSONData(await readFileAsText(file))
        else if (ext === 'zip') data = await parseZIP(await readFileAsArrayBuffer(file))

        const cols = detectColumns(data)
        setRows(data)
        setColumns(cols)
        setHistory(createHistoryEntry([], data))
        setHistoryIdx(0)
        setLog((l) => [...l, `Cargado ${data.length} filas.`])
      } catch {
        setLog((l) => [...l, 'Error al leer archivo'])
      }
    },
    [],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const undo = () => {
    const res = undoHistory(history, historyIdx)
    setRows(res.rows)
    setHistoryIdx(res.idx)
  }

  const redo = () => {
    const res = redoHistory(history, historyIdx)
    setRows(res.rows)
    setHistoryIdx(res.idx)
  }
  const updateCell = (i: number, key: string, value: string) => {
    setRows((r) => {
      const newRows = r.map((row, idx) => (idx === i ? { ...row, [key]: value } : row))
      const h = createHistoryEntry(history.slice(0, historyIdx + 1), newRows)
      setHistory(h)
      setHistoryIdx(h.length - 1)
      return newRows
    })
  }

  const enviar = async () => {
    await postImport('material', rows)
    setLog((l) => [...l, 'Datos enviados al servidor.'])
  }

  const exportar = async (formato: string) => {
    try {
      const blob = await fetchExport('material', formato)
      triggerDownload(blob, `export.${formato}`)
    } catch {
      setLog((l) => [...l, 'Error al exportar'])
    }
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
