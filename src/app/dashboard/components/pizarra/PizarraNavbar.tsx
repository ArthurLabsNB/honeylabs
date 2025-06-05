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
      data-oid="6ks:_w_"
    >
      <div className="flex items-center gap-2" data-oid="g1box:2">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/15 rounded"
          title="Salir"
          data-oid="ow6c8yq"
        >
          <X className="w-5 h-5" data-oid="f3huny6" />
        </button>
        <span className="font-semibold" data-oid="5ib7hcb">
          Pizarra Infinita
        </span>
      </div>
      <button
        onClick={onToggleFullscreen}
        className="p-2 hover:bg-white/15 rounded"
        title="Pantalla completa"
        data-oid="qi-l5e:"
      >
        {fullscreen ? (
          <Minimize className="w-5 h-5" data-oid="yzku-5z" />
        ) : (
          <Maximize className="w-5 h-5" data-oid="561ajjb" />
        )}
      </button>
    </header>
  );
}
