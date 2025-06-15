"use client";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useParams } from "next/navigation";
import { decodeQR } from "@/lib/qr";

export default function ScanAlmacenPage() {
  const { id } = useParams();
  const [codigo, setCodigo] = useState<string | null>(null);
  const [datos, setDatos] = useState<any>(null);

  useEffect(() => {
    const qr = new Html5Qrcode("qr-reader");
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
    if (codigo) setDatos(decodeQR(codigo));
  }, [codigo]);

  if (!id) return null;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Escanear código</h1>
      <div id="qr-reader" className="w-full h-64 bg-black rounded-md" />
      {datos && (
        <pre className="text-xs whitespace-pre-wrap break-all">
          {JSON.stringify(datos, null, 2)}
        </pre>
      )}
    </div>
  );
}
