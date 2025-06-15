"use client";
import { useState, useRef, useEffect } from "react";
import { useZxing } from "react-zxing";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permiso, setPermiso] = useState(false);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        setStream(s);
        setPermiso(true);
      })
      .catch(() => setPermiso(false));
  }, []);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  useZxing({
    ref: videoRef,
    onDecodeResult: (r) => setCodigo(r.getText()),
    paused: !permiso,
  });

  useEffect(() => {
    if (codigo) {
      router.push(`/dashboard/almacenes/${codigo}`);
    }
  }, [codigo, router]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Escanear código</h1>
      <video ref={videoRef} className="w-full rounded-md bg-black" />
      {codigo && <p className="text-sm">Código: {codigo}</p>}
    </div>
  );
}
