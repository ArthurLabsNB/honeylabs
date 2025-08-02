"use client";
import { useEffect, useState, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { decodeQRImageFile } from "@/lib/qrImage";
import { hasCamera, stopScannerSafely } from "@/lib/scanUtils";
import * as logger from "@lib/logger";
import { triggerDownload } from "@/app/dashboard/utils/auditoriaExport";
import ScanInfo from "./ScanInfo";
import { useDashboardUI } from "../ui";
import { RotateCcw, Pencil, Download, Maximize2 } from "lucide-react";

export default function InventarioPage() {
  const router = useRouter();
  const { toggleFullscreen } = useDashboardUI();
  const [codigo, setCodigo] = useState<string | null>(null);
  const [info, setInfo] = useState<any | null>(null);
  const [camera, setCamera] = useState(false);
  const [useCameraScan, setUseCameraScan] = useState(false);
  const prevCodigo = useRef<string | null>(null);

  useEffect(() => {
    logger.debug('InventarioPage mounted')
  }, [])

  useEffect(() => {
    hasCamera().then((v) => {
      setCamera(v);
      setUseCameraScan(v);
    });
  }, []);

  useEffect(() => {
    if (!useCameraScan) return;
    const qr = new Html5Qrcode("qr-reader-inv");
    try {
      qr
        .start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, (txt) => setCodigo(txt))
        .catch(() => setUseCameraScan(false));
    } catch {
      setUseCameraScan(false);
    }
    return () => {
      stopScannerSafely(qr);
    };
  }, [useCameraScan]);

  // Temporalmente se deshabilita la consulta a /api/qr/importar
  const fetchInfo = useDebouncedCallback((code: string) => {
    logger.debug('fetchInfo disabled', code);
    setInfo(null);
  }, 300);

  const fetchRef = useRef(fetchInfo);
  useEffect(() => {
    fetchRef.current = fetchInfo;
  }, [fetchInfo]);

  useEffect(() => {
    if (!codigo || codigo === prevCodigo.current) return;
    prevCodigo.current = codigo;
    fetchRef.current(codigo);
  }, [codigo]);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const txt = await decodeQRImageFile(file);
    if (txt) setCodigo(txt);
  };

  const reload = () => {
    setCodigo(null);
    setInfo(null);
  };

  const edit = () => {
    if (!info?.tipo) return;
    const obj = info[info.tipo];
    if (!obj?.id) return;
    let path = "";
    if (info.tipo === "almacen") path = `/dashboard/almacenes/${obj.id}/editar`;
    if (info.tipo === "material") path = `/dashboard/materiales/${obj.id}/editar`;
    if (info.tipo === "unidad") {
      const mid = info.material?.id;
      if (mid) path = `/dashboard/materiales/${mid}/unidades/${obj.id}/editar`;
    }
    if (path) router.push(path);
  };

  const exportar = () => {
    if (!info) return;
    const blob = new Blob([JSON.stringify(info, null, 2)], { type: "application/json" });
    triggerDownload(blob, "escaneo.json");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 p-4">
      <div className="space-y-4">
        {useCameraScan ? (
          <div id="qr-reader-inv" className="w-full h-64 bg-black rounded" />
        ) : (
          <>
            <button onClick={() => setUseCameraScan(camera)} className="dashboard-btn">
              📷 Escanear código QR
            </button>
            {!camera && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files)}
                aria-label="Subir QR"
                className="dashboard-input mt-2"
              />
            )}
          </>
        )}
        {camera && (
          <button onClick={() => setUseCameraScan(!useCameraScan)} className="dashboard-btn">
            {useCameraScan ? "Subir imagen" : "Usar cámara"}
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={reload} className="dashboard-btn" title="Recargar">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={edit} className="dashboard-btn" title="Editar">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={exportar} className="dashboard-btn" title="Exportar">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={toggleFullscreen} className="dashboard-btn" title="Pantalla completa">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
        <ScanInfo info={info} />
      </div>
    </div>
  );
}
