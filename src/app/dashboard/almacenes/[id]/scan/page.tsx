"use client";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useParams } from "next/navigation";
import { decodeQR } from "@/lib/qr";
import { decodeQRImageFile } from "@/lib/qrImage";
import { apiFetch } from "@lib/api";

export default function ScanAlmacenPage() {
  const { id } = useParams()
  const [codigo, setCodigo] = useState<string | null>(null)
  const [info, setInfo] = useState<any>(null)
  const [observaciones, setObservaciones] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [data, setData] = useState<Record<string, any> | null>(null)
  const [archivos, setArchivos] = useState<File[]>([])
  const [nuevoStock, setNuevoStock] = useState('')
  const [hasCamera, setHasCamera] = useState<boolean | null>(null)
  const [useCamera, setUseCamera] = useState(false)

  useEffect(() => {
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devs) => {
          const has = devs.some((d) => d.kind === 'videoinput')
          setHasCamera(has)
          setUseCamera(has)
        })
        .catch(() => setHasCamera(false))
    } else {
      setHasCamera(false)
    }
  }, [])

  useEffect(() => {
    if (!useCamera) return
    const qr = new Html5Qrcode('qr-reader')
    qr
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (txt) => setCodigo(txt)
      )
      .catch(() => setUseCamera(false))
    return () => {
      qr.stop().catch(() => {})
    }
  }, [useCamera])

  useEffect(() => {
    if (!codigo) return
    apiFetch('/api/qr/importar', {
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
        apiFetch('/api/discrepancias', {
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

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    const txt = await decodeQRImageFile(file)
    if (txt) setCodigo(txt)
  }

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
    const res = await apiFetch('/api/reportes', {
      method: 'POST',
      body: form,
    })
    if (res.ok) {
      const json = await res.json()
      await apiFetch('/api/auditorias', {
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
    await apiFetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setMensaje('Reporte y objeto actualizados')
  }

  const ajustarStock = async () => {
    if (!info?.tipo || info.tipo !== 'material') return
    const objetoId = info.material?.id
    if (!objetoId) return
    const res = await apiFetch(`/api/materiales/${objetoId}/ajuste`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: Number(nuevoStock) })
    })
    if (res.ok) {
      setMensaje('Stock ajustado')
    } else {
      setMensaje('Error al ajustar')
    }
  }

  const confirmarUnidad = async () => {
    if (info?.tipo !== 'unidad') return
    const uid = info.unidad?.id
    const mid = info.material?.id
    if (!uid || !mid) return
    await apiFetch(`/api/materiales/${mid}/unidades/${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'confirmado' })
    })
    setMensaje('Unidad confirmada')
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Escanear código</h1>
      {useCamera ? (
        <div id="qr-reader" className="w-full h-64 bg-black rounded-md" />
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files)}
          aria-label="Subir QR"
          className="dashboard-input"
        />
      )}
      {hasCamera && (
        <button onClick={() => setUseCamera(!useCamera)} className="dashboard-btn">
          {useCamera ? 'Subir imagen' : 'Usar cámara'}
        </button>
      )}
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
            {info?.tipo === 'material' && (
              <div className="flex gap-2">
                <input
                  value={nuevoStock}
                  onChange={(e) => setNuevoStock(e.target.value)}
                  className="dashboard-input flex-1"
                  placeholder="Nuevo stock"
                />
                <button onClick={ajustarStock} className="dashboard-btn">
                  Ajustar
                </button>
              </div>
            )}
            {info?.tipo === 'unidad' &&
              (info.unidad?.estado === 'pendiente' || info.unidad?.estado === 'transito') && (
                <button onClick={confirmarUnidad} className="dashboard-btn">
                  Confirmar unidad
                </button>
              )}
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

