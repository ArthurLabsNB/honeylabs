"use client";
import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { decodeQRImageFile } from "@/lib/qrImage";
import { fetchScanInfo, hasCamera } from "@/lib/scanUtils";
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

  useEffect(() => {
    hasCamera().then((v) => {
      setCamera(v);
      setUseCameraScan(v);
    });
  }, []);

  useEffect(() => {
    if (!useCameraScan) return;
    const qr = new Html5Qrcode("qr-reader-inv");
    qr.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, (txt) => setCodigo(txt))
      .catch(() => setUseCameraScan(false));
    return () => {
      qr.stop().catch(() => {});
    };
  }, [useCameraScan]);

  useEffect(() => {
    if (!codigo) return;
    fetchScanInfo(codigo).then((d) => setInfo(d)).catch(() => setInfo(null));
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
