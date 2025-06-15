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

  if (!id) return null

  const guardar = async () => {
    if (!info?.tipo) return
    const objetoId = info[info.tipo]?.id
    if (!objetoId) return
    const res = await fetch('/api/reportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: info.tipo,
        objetoId,
        observaciones,
        categoria: 'verificacion',
      }),
    })
    if (res.ok) {
      setMensaje('Reporte guardado')
      setObservaciones('')
    } else {
      setMensaje('Error al guardar')
    }
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
            <textarea
              className="dashboard-input w-full"
              placeholder="Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
            <button onClick={guardar} className="dashboard-btn">
              Guardar reporte
            </button>
            {mensaje && <div className="text-xs">{mensaje}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
