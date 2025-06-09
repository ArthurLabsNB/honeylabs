"use client";
import { useEffect, useRef, useState } from "react";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [codigo, setCodigo] = useState<string | null>(null);

  useEffect(() => {
    const start = async () => {
      if (!('BarcodeDetector' in window)) return;
      const detector = new (window as any).BarcodeDetector({ formats: ['code_128', 'qr_code', 'ean_13', 'ean_8'] });
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const scan = async () => {
        if (!videoRef.current) return requestAnimationFrame(scan);
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes[0]) {
            setCodigo(codes[0].rawValue);
          } else {
            requestAnimationFrame(scan);
          }
        } catch {
          requestAnimationFrame(scan);
        }
      };
      requestAnimationFrame(scan);
    };
    start();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Escanear código</h1>
      <video ref={videoRef} className="w-full rounded-md bg-black" />
      {codigo && <p className="text-sm">Código: {codigo}</p>}
    </div>
  );
}
