"use client";
import useSpeech from "@/hooks/useSpeech";

export default function VozPage() {
  const { texto, activo, setActivo } = useSpeech();

  return (
    <div className="p-4 space-y-4" data-oid="voz-root">
      <h1 className="text-2xl font-bold">Voz y Dictado</h1>
      <button className="dashboard-button" onClick={() => setActivo(!activo)}>
        {activo ? "Detener" : "Escuchar"}
      </button>
      <div className="bg-white/10 p-3 rounded text-sm min-h-[4rem]">
        {texto || "Sin transcripción"}
      </div>
    </div>
  );
}
