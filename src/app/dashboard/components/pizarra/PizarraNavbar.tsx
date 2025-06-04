"use client";
import { Maximize, Minimize } from "lucide-react";

interface Props {
  onToggleFullscreen: () => void;
  fullscreen: boolean;
}

export default function PizarraNavbar({ onToggleFullscreen, fullscreen }: Props) {
  return (
    <header
      className="flex items-center justify-between p-2 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]"
      style={{ minHeight: "50px" }}
    >
      <span className="font-semibold">Pizarra Infinita</span>
      <button
        onClick={onToggleFullscreen}
        className="p-2 hover:bg-white/15 rounded"
        title="Pantalla completa"
      >
        {fullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>
    </header>
  );
}
