"use client";

import { Maximize, Minimize, X } from "lucide-react";

interface Props {
  onClose: () => void;
  onToggleFullscreen: () => void;
  fullscreen: boolean;
}


export default function PizarraNavbar({ onClose, onToggleFullscreen, fullscreen }: Props) {
  return (
    <header className="flex items-center justify-between p-2 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]" style={{minHeight: '50px'}}>
      <div className="flex items-center gap-2">
        <button onClick={onClose} className="p-2 hover:bg-white/15 rounded" title="Salir">
          <X className="w-5 h-5" />
        </button>
        <span className="font-semibold">Pizarra Infinita</span>
      </div>
      <button onClick={onToggleFullscreen} className="p-2 hover:bg-white/15 rounded" title="Pantalla completa">
        {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>
    </header>
  );
}
