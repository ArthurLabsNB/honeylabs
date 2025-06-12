"use client"
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  getFileExt,
  readFileAsArrayBuffer,
  readFileAsText,
  parseCSV,
  parseSpreadsheet,
  parseJSONData,
  parseXML,
  parseYAML,
  parseTXT,
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
  const [mapping, setMapping] = useState<Record<string, string>>({})

  useEffect(() => {
    setMapping(Object.fromEntries(columns.map(c => [c, c])))
  }, [columns])

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
        else if (ext === 'xml') data = parseXML(await readFileAsText(file))
        else if (ext === 'yaml' || ext === 'yml') data = parseYAML(await readFileAsText(file))
        else if (ext === 'txt') data = parseTXT(await readFileAsText(file))
        else if (ext === 'zip') data = await parseZIP(await readFileAsArrayBuffer(file))

        const cols = detectColumns(data)
        setRows(data)
        setColumns(cols)
        setMapping(Object.fromEntries(cols.map(c => [c, c])))
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
    const mapeado = rows.map(r => {
      const obj: Record<string, any> = {}
      for (const [col, field] of Object.entries(mapping)) {
        obj[field] = r[col]
      }
      return obj
    })
    await postImport('material', mapeado)
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
    <div className="p-4 grid gap-4 grid-cols-[220px_1fr_240px]">
      <aside className="space-y-4">
        <h1 className="text-xl font-bold">Gestión de Archivos</h1>
        <div
          {...getRootProps()}
          className="border-dashed border rounded p-6 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? 'Suelta el archivo...' : 'Arrastra o haz clic para seleccionar un archivo'}
        </div>
        <div className="flex gap-2">
          <button onClick={undo} className="px-3 py-1 border rounded w-full">Deshacer</button>
          <button onClick={redo} className="px-3 py-1 border rounded w-full">Rehacer</button>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => exportar('csv')} className="px-3 py-1 border rounded">Exportar CSV</button>
          <button onClick={() => exportar('json')} className="px-3 py-1 border rounded">Exportar JSON</button>
          <button onClick={() => exportar('zip')} className="px-3 py-1 border rounded">Exportar ZIP</button>
        </div>
        <div>
          <h2 className="font-bold mb-1">Historial</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="overflow-auto">
        {columns.length > 0 && (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {columns.map(c => (
                  <th key={c} className="border px-2 py-1 text-left">{c}</th>
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
        )}
      </main>
      <aside className="space-y-4">
        <h2 className="font-bold">Asignar columnas</h2>
        {columns.map(c => (
          <div key={c}>
            <label className="text-xs block mb-1">{c}</label>
            <select
              className="border px-2 py-1 w-full"
              value={mapping[c] ?? ''}
              onChange={e => setMapping({ ...mapping, [c]: e.target.value })}
            >
              {campos.map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={enviar}
          className="px-3 py-1 border rounded bg-blue-500 text-white w-full"
        >
          Importar
        </button>
      </aside>
    </div>
  )
}
