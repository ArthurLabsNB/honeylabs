"use client";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { decodeQR } from "@/lib/qr";
import { decodeQRImageFile } from "@/lib/qrImage";
import { stopScannerSafely } from "@/lib/scanUtils";

export default function ScanPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [useCamera, setUseCamera] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devs) => {
          const has = devs.some((d) => d.kind === 'videoinput');
          setHasCamera(has);
          setUseCamera(has);
        })
        .catch(() => setHasCamera(false));
    } else {
      setHasCamera(false);
    }
  }, []);

  useEffect(() => {
    if (!useCamera) return;
    const qr = new Html5Qrcode("qr-reader-main");
    try {
      qr
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (txt) => setCodigo(txt)
        )
        .catch(() => setUseCamera(false));
    } catch {
      setUseCamera(false);
    }
    return () => {
      stopScannerSafely(qr);
    };
  }, [useCamera]);

  useEffect(() => {
    const data = codigo ? decodeQR(codigo) : null;
    if (data && typeof data === "object" && data.id) {
      router.push(`/dashboard/almacenes/${data.id}`);
    } else if (codigo) {
      router.push(`/dashboard/almacenes/${codigo}`);
    }
  }, [codigo, router]);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const txt = await decodeQRImageFile(file);
    if (txt) setCodigo(txt);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Escanear código</h1>
      {useCamera ? (
        <div id="qr-reader-main" className="w-full h-64 bg-black rounded-md" />
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
          {useCamera ? "Subir imagen" : "Usar cámara"}
        </button>
      )}
    </div>
  );
}
