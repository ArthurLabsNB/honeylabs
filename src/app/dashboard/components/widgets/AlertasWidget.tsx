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
      data-oid="32k7fwf"
    >
      <div
        className="flex items-center justify-between mb-3"
        data-oid="u5-x0v3"
      >
        <h3
          className="font-extrabold text-xl tracking-tight"
          data-oid="wb.max6"
        >
          Alertas
        </h3>
        <button
          onClick={() => setShow(false)}
          className="text-xl text-red-500 hover:bg-red-700/15 p-1 rounded-full transition"
          title="Cerrar"
          data-oid="pbft.sz"
        >
          <X size={22} data-oid="txsx9o4" />
        </button>
      </div>
      {loading ? (
        <div
          className="animate-blink text-[var(--dashboard-accent)] font-semibold py-6 text-center"
          data-oid="t3-a.95"
        >
          Cargando alertas...
        </div>
      ) : err ? (
        <div className="text-red-400 py-4" data-oid="qa69vw1">
          Error: {err}
        </div>
      ) : (
        <>
          <div
            className="text-lg font-bold text-yellow-300 mb-2"
            data-oid="f0_1sfj"
          >
            Tienes {alertas.length} alerta{alertas.length !== 1 && "s"}
          </div>
          {alertas.length === 0 && (
            <div
              className="text-[var(--dashboard-muted)] py-5 text-center"
              data-oid="8ipooe:"
            >
              ¡Sin alertas pendientes!
            </div>
          )}
          <div className="flex flex-col gap-3" data-oid="gjn:cur">
            {alertas.map((a) => (
              <div
                key={a.id}
                className={`
                  p-4 rounded-xl border-l-4 shadow-sm
                  ${prioridadColor[a.prioridad] || "bg-[#23232b] border-[#ffe066]"}
                  transition
                `}
                style={{ position: "relative" }}
                data-oid="u2ayle."
              >
                <div className="font-bold mb-1" data-oid="cz7e1vf">
                  {a.titulo}
                </div>
                {a.descripcion && (
                  <div
                    className="text-sm text-[var(--dashboard-muted)] mb-1"
                    data-oid="1y96h7q"
                  >
                    {a.descripcion}
                  </div>
                )}
                <div className="text-xs flex gap-3 mt-1" data-oid="oosb3w-">
                  <span data-oid="7i487u1">
                    {new Date(a.fecha).toLocaleDateString()}
                  </span>
                  <span data-oid="bxcqowo">
                    Prioridad:{" "}
                    <span className="font-semibold" data-oid="lq577x_">
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
