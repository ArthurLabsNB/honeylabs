"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

// Utilidad para pintar colores según prioridad
const prioridadColor = {
  ALTA: "bg-[#db3636]/90 border-[#db3636] text-white",
  MEDIA: "bg-[#ffe06622] border-[#ffe066] text-yellow-200",
  BAJA: "bg-[#226d30]/90 border-[#226d30] text-green-100",
};

type Alerta = {
  id: number;
  titulo: string;
  fecha: string; // ISO
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  descripcion?: string;
};

export default function AlertasWidget({ usuario }: { usuario: any }) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    setErr(null);
    fetch(`/api/alertas?usuarioId=${usuario.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Error consultando alertas");
        const data = await res.json();
        setAlertas(data.alertas || []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (!show) return null;

  return (
    <div
      className="dashboard-widget-card relative animate-fade-in"
      data-oid="dl77p:8"
    >
      <div
        className="flex items-center justify-between mb-3"
        data-oid="77tplf7"
      >
        <h3
          className="font-extrabold text-xl tracking-tight"
          data-oid="3w9ymc8"
        >
          Alertas
        </h3>
        <button
          onClick={() => setShow(false)}
          className="text-xl text-red-500 hover:bg-red-700/15 p-1 rounded-full transition"
          title="Cerrar"
          data-oid="eh3e049"
        >
          <X size={22} data-oid="9p2qe4p" />
        </button>
      </div>
      {loading ? (
        <div
          className="animate-blink text-[var(--dashboard-accent)] font-semibold py-6 text-center"
          data-oid="2wh_zjy"
        >
          Cargando alertas...
        </div>
      ) : err ? (
        <div className="text-red-400 py-4" data-oid="_nqjl0z">
          Error: {err}
        </div>
      ) : (
        <>
          <div
            className="text-lg font-bold text-yellow-300 mb-2"
            data-oid="v191h83"
          >
            Tienes {alertas.length} alerta{alertas.length !== 1 && "s"}
          </div>
          {alertas.length === 0 && (
            <div
              className="text-[var(--dashboard-muted)] py-5 text-center"
              data-oid="ngtuzq5"
            >
              ¡Sin alertas pendientes!
            </div>
          )}
          <div className="flex flex-col gap-3" data-oid="cbdu8gt">
            {alertas.map((a) => (
              <div
                key={a.id}
                className={`
                  p-4 rounded-xl border-l-4 shadow-sm
                  ${prioridadColor[a.prioridad] || "bg-[#23232b] border-[#ffe066]"}
                  transition
                `}
                style={{ position: "relative" }}
                data-oid="7.r9e-l"
              >
                <div className="font-bold mb-1" data-oid="2b-86se">
                  {a.titulo}
                </div>
                {a.descripcion && (
                  <div
                    className="text-sm text-[var(--dashboard-muted)] mb-1"
                    data-oid="_gu_wdy"
                  >
                    {a.descripcion}
                  </div>
                )}
                <div className="text-xs flex gap-3 mt-1" data-oid="rl.m2qz">
                  <span data-oid=":w5l1pg">
                    {new Date(a.fecha).toLocaleDateString()}
                  </span>
                  <span data-oid="4edzmob">
                    Prioridad:{" "}
                    <span className="font-semibold" data-oid="ejk1zhh">
                      {a.prioridad}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
