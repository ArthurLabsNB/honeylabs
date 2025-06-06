"use client";

import { Maximize, Minimize, X } from "lucide-react";

interface Props {
  onClose: () => void;
  onToggleFullscreen: () => void;
  fullscreen: boolean;
}

export default function PizarraNavbar({
  onClose,
  onToggleFullscreen,
  fullscreen,
}: Props) {
  return (
    <header
      className="flex items-center justify-between p-2 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]"
      style={{ minHeight: "50px" }}
      data-oid="e_opvc_"
    >
      <div className="flex items-center gap-2" data-oid="n.anie6">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/15 rounded"
          title="Salir"
          data-oid="vrxl_ap"
        >
          <X className="w-5 h-5" data-oid="qga9c2q" />
        </button>
        <span className="font-semibold" data-oid="d:gi__3">
          Pizarra Infinita
        </span>
      </div>
      <button
        onClick={onToggleFullscreen}
        className="p-2 hover:bg-white/15 rounded"
        title="Pantalla completa"
        data-oid="gqdbgyb"
      >
        {fullscreen ? (
          <Minimize className="w-5 h-5" data-oid="qm28.g5" />
        ) : (
          <Maximize className="w-5 h-5" data-oid="y3a5uvj" />
        )}
      </button>
    </header>
  );
}
