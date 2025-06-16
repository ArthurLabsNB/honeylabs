"use client";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useParams } from "next/navigation";
import { decodeQR } from "@/lib/qr";

export default function ScanAlmacenPage() {
  const { id } = useParams()
  const [codigo, setCodigo] = useState<string | null>(null)
  const [info, setInfo] = useState<any>(null)
  const [observaciones, setObservaciones] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [data, setData] = useState<Record<string, any> | null>(null)
  const [archivos, setArchivos] = useState<File[]>([])

  useEffect(() => {
    const qr = new Html5Qrcode('qr-reader')
    qr
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (txt) => setCodigo(txt)
      )
      .catch(() => {});
    return () => {
      qr.stop().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!codigo) return
    fetch('/api/qr/importar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.tipo) setInfo(d)
        else setInfo(decodeQR(codigo))
      })
      .catch(() => setInfo(null))
  }, [codigo])

  useEffect(() => {
    if (!info?.tipo) return
    const original = decodeQR(codigo || '')
    if (!original || typeof original !== 'object') return
    const obj = info[info.tipo]
    if (!obj) return
    Object.entries(original).forEach(([k, v]) => {
      if (k !== 'id' && obj[k] != null && obj[k] !== v) {
        fetch('/api/discrepancias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: info.tipo,
            objetoId: obj.id,
            campo: k,
            actual: obj[k],
            escaneado: v,
          }),
        })
      }
    })
  }, [info])

  useEffect(() => {
    if (!info?.tipo) return
    const obj = info[info.tipo]
    if (obj && typeof obj === 'object') {
      const editable: Record<string, any> = {}
      Object.entries(obj).forEach(([k, v]) => {
        if (k !== 'id' && (typeof v === 'string' || typeof v === 'number'))
          editable[k] = v as any
      })
      setData(editable)
    }
  }, [info])

  if (!id) return null

  const guardar = async () => {
    if (!info?.tipo) return
    const objetoId = info[info.tipo]?.id
    if (!objetoId) return
    const form = new FormData()
    form.append('tipo', info.tipo)
    form.append('objetoId', String(objetoId))
    form.append('observaciones', observaciones)
    form.append('categoria', 'verificacion')
    archivos.forEach(a => form.append('archivos', a))
    const res = await fetch('/api/reportes', {
      method: 'POST',
      body: form,
    })
    if (res.ok) {
      const json = await res.json()
      await fetch('/api/auditorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporteId: json.reporte.id }),
      })
      setMensaje('Reporte guardado')
      setObservaciones('')
    } else {
      setMensaje('Error al guardar')
    }
  }

  const guardarYActualizar = async () => {
    if (!info?.tipo || !data) return
    await guardar()
    const objetoId = info[info.tipo]?.id
    if (!objetoId) return
    let url = ''
    if (info.tipo === 'almacen') url = `/api/almacenes/${objetoId}`
    if (info.tipo === 'material') url = `/api/materiales/${objetoId}`
    if (info.tipo === 'unidad') {
      const mid = info.material?.id
      if (!mid) return
      url = `/api/materiales/${mid}/unidades/${objetoId}`
    }
    if (!url) return
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setMensaje('Reporte y objeto actualizados')
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Escanear código</h1>
      <div id="qr-reader" className="w-full h-64 bg-black rounded-md" />
      {info && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-2 text-xs overflow-auto">
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(info, null, 2)}
            </pre>
          </div>
          <div className="border rounded p-2 space-y-2">
            {data &&
              Object.entries(data).map(([k, v]) => (
                <input
                  key={k}
                  value={v as any}
                  onChange={(e) =>
                    setData((d) => (d ? { ...d, [k]: e.target.value } : d))
                  }
                  className="dashboard-input w-full"
                  placeholder={k}
                />
              ))}
            <textarea
              className="dashboard-input w-full"
              placeholder="Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
            <input
              type="file"
              multiple
              onChange={(e) =>
                setArchivos(Array.from(e.target.files || []))
              }
              className="dashboard-input"
            />
            <button onClick={guardar} className="dashboard-btn">
              Guardar reporte
            </button>
            <button onClick={guardarYActualizar} className="dashboard-btn">
              Guardar y actualizar
            </button>
            {mensaje && <div className="text-xs">{mensaje}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
