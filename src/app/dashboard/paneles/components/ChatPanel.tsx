"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import useSession from "@/hooks/useSession";
import type { MensajeChat } from "@/types/chat";
import { usePanelOps } from "../PanelOpsContext";

const fetcher = (url: string) => apiFetch(url).then(jsonOrNull);

export default function ChatPanel({ canalId }: { canalId: number }) {
  const { setMostrarChat } = usePanelOps();
  const { usuario } = useSession();
  const { data, mutate } = useSWR<{ mensajes: MensajeChat[] }>(
    `/api/chat?canalId=${canalId}`,
    fetcher,
  );
  const [texto, setTexto] = useState("");
  const enviar = async () => {
    if (!texto.trim()) return;
    const form = new FormData();
    form.append("canalId", String(canalId));
    form.append("texto", texto.trim());
    await apiFetch("/api/chat", { method: "POST", body: form });
    setTexto("");
    mutate();
  };
  useEffect(() => {
    const id = setInterval(() => mutate(), 4000);
    return () => clearInterval(id);
  }, [mutate]);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40" onClick={() => setMostrarChat(() => {})}>
      <div className="bg-[var(--dashboard-card)] p-4 rounded max-h-[80vh] overflow-auto w-80" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-semibold mb-2">Chat</h2>
        <ul className="space-y-2 text-sm mb-2">
          {data?.mensajes?.map((m) => (
            <li key={m.id} className="border-b border-white/10 pb-1">
              <span className="font-semibold">{m.usuario.nombre}</span>
              <span className="text-xs ml-2 text-gray-400">{new Date(m.fecha).toLocaleTimeString()}</span>
              {m.texto && <p>{m.texto}</p>}
            </li>
          ))}
        </ul>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="w-full mt-3 p-2 bg-white/10 rounded text-sm"
          rows={3}
        />
        <button onClick={enviar} className="mt-2 px-3 py-1 bg-white/10 rounded w-full text-sm">
          Enviar
        </button>
        <button onClick={() => setMostrarChat(() => {})} className="mt-2 px-3 py-1 bg-white/10 rounded w-full text-sm">
          Cerrar
        </button>
      </div>
    </div>
  );
}

