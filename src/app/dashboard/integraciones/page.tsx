"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";

const servicios = ["googleDrive", "dropbox", "slack", "msTeams", "jira", "trello"];

export default function IntegracionesPage() {
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiFetch("/api/integraciones")
      .then(jsonOrNull)
      .then((d) => setTokens(d.integraciones || {}));
  }, []);

  const guardar = async () => {
    await apiFetch("/api/integraciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tokens),
    });
    setMsg("Guardado");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Integraciones</h1>
      {servicios.map((s) => (
        <div key={s} className="flex items-center gap-2">
          <label className="w-32 capitalize">{s}</label>
          <input
            type="text"
            value={tokens[s] || ""}
            onChange={(e) => setTokens({ ...tokens, [s]: e.target.value })}
            className="border p-1 flex-1 rounded"
          />
        </div>
      ))}
      <button onClick={guardar} className="bg-blue-600 text-white px-4 py-1 rounded">
        Guardar
      </button>
      {msg && <span className="ml-2 text-green-600">{msg}</span>}
    </div>
  );
}
