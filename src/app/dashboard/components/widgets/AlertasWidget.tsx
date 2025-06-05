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
      data-oid=":006ouf"
    >
      <div
        className="flex items-center justify-between mb-3"
        data-oid="5bxx:v0"
      >
        <h3
          className="font-extrabold text-xl tracking-tight"
          data-oid="wj__tsc"
        >
          Alertas
        </h3>
        <button
          onClick={() => setShow(false)}
          className="text-xl text-red-500 hover:bg-red-700/15 p-1 rounded-full transition"
          title="Cerrar"
          data-oid="dfj3u2i"
        >
          <X size={22} data-oid="2cb67jd" />
        </button>
      </div>
      {loading ? (
        <div
          className="animate-blink text-[var(--dashboard-accent)] font-semibold py-6 text-center"
          data-oid="az4-.7g"
        >
          Cargando alertas...
        </div>
      ) : err ? (
        <div className="text-red-400 py-4" data-oid="418osb_">
          Error: {err}
        </div>
      ) : (
        <>
          <div
            className="text-lg font-bold text-yellow-300 mb-2"
            data-oid="_tg7-z5"
          >
            Tienes {alertas.length} alerta{alertas.length !== 1 && "s"}
          </div>
          {alertas.length === 0 && (
            <div
              className="text-[var(--dashboard-muted)] py-5 text-center"
              data-oid="l06ktdj"
            >
              ¡Sin alertas pendientes!
            </div>
          )}
          <div className="flex flex-col gap-3" data-oid="e_-i5jt">
            {alertas.map((a) => (
              <div
                key={a.id}
                className={`
                  p-4 rounded-xl border-l-4 shadow-sm
                  ${prioridadColor[a.prioridad] || "bg-[#23232b] border-[#ffe066]"}
                  transition
                `}
                style={{ position: "relative" }}
                data-oid="sw9.rgs"
              >
                <div className="font-bold mb-1" data-oid="hum.e_n">
                  {a.titulo}
                </div>
                {a.descripcion && (
                  <div
                    className="text-sm text-[var(--dashboard-muted)] mb-1"
                    data-oid="._344xy"
                  >
                    {a.descripcion}
                  </div>
                )}
                <div className="text-xs flex gap-3 mt-1" data-oid="w3clgk:">
                  <span data-oid="hs_p80u">
                    {new Date(a.fecha).toLocaleDateString()}
                  </span>
                  <span data-oid="1z1tx:_">
                    Prioridad:{" "}
                    <span className="font-semibold" data-oid="05e35n5">
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
