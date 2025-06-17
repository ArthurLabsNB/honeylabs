"use client";
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import useSession from "@/hooks/useSession";
import type { MensajeChat } from "@/types/chat";
import { usePanelOps } from "../PanelOpsContext";
import { useToast } from "@/components/Toast";

const fetcher = (url: string) => apiFetch(url).then(jsonOrNull);

export default function ChatPanel({ canalId }: { canalId: number }) {
  const { setMostrarChat } = usePanelOps();
  const { usuario } = useSession();
  const toast = useToast();
  const { data, mutate } = useSWR<{ mensajes: MensajeChat[] }>(
    `/api/chat?canalId=${canalId}`,
    fetcher,
  );
  const [texto, setTexto] = useState("");
  const lastId = useRef<number>(0)
  const listRef = useRef<HTMLUListElement>(null)
  const enviar = async () => {
    if (!texto.trim()) return;
    const form = new FormData();
    form.append("canalId", String(canalId));
    form.append("texto", texto.trim());
    await apiFetch("/api/chat", { method: "POST", body: form });
    setTexto("");
    mutate();
    setTimeout(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight), 50)
  };
  useEffect(() => {
    const id = setInterval(() => mutate(), 4000);
    return () => clearInterval(id);
  }, [canalId]);

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo(0, el.scrollHeight)
  }, [data])

  useEffect(() => {
    const msgs = data?.mensajes
    if (!msgs || !msgs.length) return
    const latest = msgs[msgs.length - 1]
    if (latest.id !== lastId.current && latest.usuario.id !== usuario?.id) {
      toast.show('Nuevo mensaje en chat', 'info')
      lastId.current = latest.id
    }
  }, [data, usuario, toast])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40" onClick={() => setMostrarChat(() => {})}>
      <div className="bg-[var(--dashboard-card)] p-4 rounded max-h-[80vh] overflow-auto w-80" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-semibold mb-2">Chat</h2>
        <ul ref={listRef} className="space-y-2 text-sm mb-2 max-h-48 overflow-auto">
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

