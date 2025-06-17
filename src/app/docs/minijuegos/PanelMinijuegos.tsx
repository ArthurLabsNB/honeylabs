"use client";
import { useState, useEffect, useCallback } from "react";
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
  const [juegoActual, setJuegoActual] = useState<Juego | null>(null)
  const [iniciado, setIniciado] = useState(false)
  const cerrar = useCallback(() => setJuegoActual(null), [])

  useEffect(() => {
    if (!juegoActual) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [juegoActual])

  useEffect(() => {
    setIniciado(false)
  }, [juegoActual])

  return (
    <div className="space-y-4">
      {juegoActual ? (
        <div>
          <button
            onClick={cerrar}
            className="mb-2 px-3 py-1 rounded bg-miel text-[#22223b] font-bold text-xs shadow"
          >
            &larr; Volver
          </button>
          {!iniciado ? (
            <div className="flex flex-col items-center gap-2">
              <p className="font-semibold">{juegoActual.nombre}</p>
              <button
                onClick={() => setIniciado(true)}
                className="px-3 py-1 bg-miel text-[#22223b] rounded"
              >
                Comenzar
              </button>
            </div>
          ) : juegoActual.plataforma === "gba" ? (
            <EmuladorGBA rom={juegoActual.archivo} />
          ) : (
            <EmuladorNES rom={juegoActual.archivo} />
          )}
        </div>
      ) : (
        <>
          <SubirRomForm onUpload={cerrar} />
          <ListaJuegos onPlay={setJuegoActual} />
        </>
      )}
    </div>
  );
}
