"use client";
import { useState, useEffect } from "react";
import SubirRomForm from "./SubirRomForm";
import ListaJuegos from "./ListaJuegos";
import EmuladorGBA from "./EmuladorGBA";
import EmuladorNES from "./EmuladorNES";

export type Juego = {
  id: number;
  nombre: string;
  plataforma: "gba" | "nes";
  archivo: string;
};

export default function PanelMinijuegos() {
  const [juegoActual, setJuegoActual] = useState<Juego | null>(null);

  useEffect(() => {
    if (!juegoActual) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [juegoActual]);

  return (
    <div className="space-y-4">
      {juegoActual ? (
        <div>
          <button
            onClick={() => setJuegoActual(null)}
            className="mb-2 px-3 py-1 rounded bg-miel text-[#22223b] font-bold text-xs shadow"
          >
            &larr; Volver
          </button>
          {juegoActual.plataforma === "gba" ? (
            <EmuladorGBA rom={juegoActual.archivo} />
          ) : (
            <EmuladorNES rom={juegoActual.archivo} />
          )}
        </div>
      ) : (
        <>
          <SubirRomForm onUpload={() => setJuegoActual(null)} />
          <ListaJuegos onPlay={setJuegoActual} />
        </>
      )}
    </div>
  );
}
