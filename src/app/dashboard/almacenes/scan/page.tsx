"use client";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { decodeQR } from "@/lib/qr";

export default function ScanPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState<string | null>(null);

  useEffect(() => {
    const qr = new Html5Qrcode("qr-reader-main");
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
    const data = codigo ? decodeQR(codigo) : null;
    if (data && typeof data === "object" && data.id) {
      router.push(`/dashboard/almacenes/${data.id}`);
    } else if (codigo) {
      router.push(`/dashboard/almacenes/${codigo}`);
    }
  }, [codigo, router]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Escanear código</h1>
      <div id="qr-reader-main" className="w-full h-64 bg-black rounded-md" />
    </div>
  );
}
