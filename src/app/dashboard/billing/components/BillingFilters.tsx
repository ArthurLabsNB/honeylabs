"use client";
import { useState } from "react";
interface Props { onChange: (q: string) => void }
export default function BillingFilters({ onChange }: Props) {
  const [q, setQ] = useState("");
  return (
    <div className="mb-4 flex gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar folio"
        className="border p-1 rounded"
      />
      <button onClick={() => onChange(q)} className="bg-blue-500 text-white px-2 rounded">
        Filtrar
      </button>
    </div>
  );
}
