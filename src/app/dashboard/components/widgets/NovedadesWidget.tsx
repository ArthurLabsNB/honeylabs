"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";

export default function NovedadesWidget({ usuario }: { usuario: any }) {
  const [items, setItems] = useState<
    { id: number; titulo: string; fecha: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    fetch("/api/novedades")
      .then(jsonOrNull)
      .then((d) => setItems(d.novedades || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [usuario]);

  return (
    <div data-oid="7h44f8l">
      <span className="font-semibold" data-oid="8i4gclv">
        Próximas novedades:
      </span>
      {loading ? (
        <div className="py-2" data-oid="x7.js7x">
          Cargando...
        </div>
      ) : err ? (
        <div className="text-red-400 py-2" data-oid="5szf3o5">
          Error: {err}
        </div>
      ) : items.length === 0 ? (
        <div className="py-2 text-[var(--dashboard-muted)]" data-oid="qhp0htz">
          Sin novedades
        </div>
      ) : (
        <ul className="list-disc pl-5 mt-1" data-oid="-ql:w3k">
          {items.map((n) => (
            <li key={n.id} data-oid="78so7re">
              {n.titulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
