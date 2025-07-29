"use client";
import { useEffect, useState } from "react";

export default function AuditoriaSummaryCard({ auditoria }: { auditoria: any }) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    async function calcHash() {
      try {
        const data = JSON.stringify(auditoria.observaciones || auditoria);
        const buffer = await crypto.subtle.digest(
          "SHA-1",
          new TextEncoder().encode(data),
        );
        const hex = Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        setHash(hex.slice(0, 8));
      } catch {
        setHash("");
      }
    }
    calcHash();
  }, [auditoria]);

  return (
    <div className="dashboard-card text-xs space-y-1">
      <div>Tipo: {auditoria.tipo}</div>
      {auditoria.categoria && <div>Categoría: {auditoria.categoria}</div>}
      {auditoria.version != null && <div>Versión: {auditoria.version}</div>}
      <div>Adjuntos: {auditoria.archivos?.length || 0}</div>
      {hash && <div>Hash: {hash}</div>}
    </div>
  );
}
