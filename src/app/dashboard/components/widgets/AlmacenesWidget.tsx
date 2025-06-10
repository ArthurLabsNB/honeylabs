"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";

export default function AlmacenesWidget({ usuario }: { usuario: any }) {
  const [cantidad, setCantidad] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    apiFetch("/api/almacenes")
      .then(jsonOrNull)
      .then((d) =>
        setCantidad(Array.isArray(d.almacenes) ? d.almacenes.length : 0),
      )
      .catch((e) => setError(e.message));
  }, [usuario]);

  return (
    <div data-oid="45nqp7w">
      <span className="font-semibold" data-oid="hk9--8k">
        Almacenes conectados:
      </span>{" "}
      {error ? (
        <span className="text-red-400 font-bold" data-oid="c.hvqo.">
          Error
        </span>
      ) : (
        <span className="text-amber-400 font-bold" data-oid="nth118d">
          {cantidad ?? "..."}
        </span>
      )}
    </div>
  );
}
