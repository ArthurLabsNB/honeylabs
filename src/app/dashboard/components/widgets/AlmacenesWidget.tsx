"use client";
import React, { useEffect, useState } from "react";

export default function AlmacenesWidget({ usuario }: { usuario: any }) {
  const [cantidad, setCantidad] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    fetch("/api/almacenes")
      .then((res) => res.json())
      .then((d) => setCantidad(Array.isArray(d.almacenes) ? d.almacenes.length : 0))
      .catch((e) => setError(e.message));
  }, [usuario]);

  return (
    <div data-oid="gx306mu">
      <span className="font-semibold" data-oid="j3t5huf">Almacenes conectados:</span>{" "}
      {error ? (
        <span className="text-red-400 font-bold">Error</span>
      ) : (
        <span className="text-amber-400 font-bold" data-oid="ln74n1.">
          {cantidad ?? "..."}
        </span>
      )}
    </div>
  );
}
