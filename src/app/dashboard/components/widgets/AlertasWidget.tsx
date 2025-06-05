"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
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
        const data = await jsonOrNull(res);
        setAlertas(data?.alertas || []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (!show) return null;

  return (
    <div
      className="dashboard-widget-card relative animate-fade-in"
      data-oid="6pnm80b"
    >
      <div
        className="flex items-center justify-between mb-3"
        data-oid="qskskla"
      >
        <h3
          className="font-extrabold text-xl tracking-tight"
          data-oid="r43wav."
        >
          Alertas
        </h3>
        <button
          onClick={() => setShow(false)}
          className="text-xl text-red-500 hover:bg-red-700/15 p-1 rounded-full transition"
          title="Cerrar"
          data-oid="3t4:v9d"
        >
          <X size={22} data-oid="s2sdzb3" />
        </button>
      </div>
      {loading ? (
        <div
          className="animate-blink text-[var(--dashboard-accent)] font-semibold py-6 text-center"
          data-oid="51q_bvu"
        >
          Cargando alertas...
        </div>
      ) : err ? (
        <div className="text-red-400 py-4" data-oid="u_xpmun">
          Error: {err}
        </div>
      ) : (
        <>
          <div
            className="text-lg font-bold text-yellow-300 mb-2"
            data-oid="fpb2-89"
          >
            Tienes {alertas.length} alerta{alertas.length !== 1 && "s"}
          </div>
          {alertas.length === 0 && (
            <div
              className="text-[var(--dashboard-muted)] py-5 text-center"
              data-oid="gcp98v8"
            >
              ¡Sin alertas pendientes!
            </div>
          )}
          <div className="flex flex-col gap-3" data-oid="-3ursq6">
            {alertas.map((a) => (
              <div
                key={a.id}
                className={`
                  p-4 rounded-xl border-l-4 shadow-sm
                  ${prioridadColor[a.prioridad] || "bg-[#23232b] border-[#ffe066]"}
                  transition
                `}
                style={{ position: "relative" }}
                data-oid="lu2xc:w"
              >
                <div className="font-bold mb-1" data-oid="rr:k2m_">
                  {a.titulo}
                </div>
                {a.descripcion && (
                  <div
                    className="text-sm text-[var(--dashboard-muted)] mb-1"
                    data-oid="1hhiz9:"
                  >
                    {a.descripcion}
                  </div>
                )}
                <div className="text-xs flex gap-3 mt-1" data-oid="5yu3bwn">
                  <span data-oid=":79xs1.">
                    {new Date(a.fecha).toLocaleDateString()}
                  </span>
                  <span data-oid="pkxkzxg">
                    Prioridad:{" "}
                    <span className="font-semibold" data-oid="u29szmg">
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
