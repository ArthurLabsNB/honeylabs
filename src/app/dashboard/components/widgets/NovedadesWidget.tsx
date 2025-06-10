"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import Spinner from "@/components/Spinner";

export default function NovedadesWidget({ usuario }: { usuario: any }) {
  const [items, setItems] = useState<
    { id: number; titulo: string; fecha: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    apiFetch("/api/novedades")
      .then(jsonOrNull)
      .then((d) => setItems(d.novedades || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [usuario]);

  return (
    <div data-oid="7vvtl6r">
      <span className="font-semibold" data-oid="0aqgt3n">
        Próximas novedades:
      </span>
      {loading ? (
        <div className="py-2" data-oid="55jxu-6">
          <Spinner />
        </div>
      ) : err ? (
        <div className="text-red-400 py-2" data-oid="k2ui6em">
          Error: {err}
        </div>
      ) : items.length === 0 ? (
        <div className="py-2 text-[var(--dashboard-muted)]" data-oid="3lpll79">
          Sin novedades
        </div>
      ) : (
        <ul className="list-disc pl-5 mt-1" data-oid="8oncvzm">
          {items.map((n) => (
            <li key={n.id} data-oid="c2i1alb">
              {n.titulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
