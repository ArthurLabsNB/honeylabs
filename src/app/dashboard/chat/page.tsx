"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import useSession from "@/hooks/useSession";
import type { CanalChat, MensajeChat } from "@/types/chat";
import Spinner from "@/components/Spinner";

export default function ChatPage() {
  const { usuario } = useSession();
  const [canalId, setCanalId] = useState<number | null>(null);
  const { data: canales } = useSWR<{
    canales: CanalChat[];
  }>("/api/chat/canales", jsonOrNull);

  const { data: mensajes, mutate } = useSWR<{
    mensajes: MensajeChat[];
  }>(canalId !== null ? `/api/chat?canalId=${canalId}` : null, jsonOrNull);

  const [texto, setTexto] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!canalId && canales?.canales?.length) {
      setCanalId(canales.canales[0].id);
    }
  }, [canales, canalId]);

  async function enviar() {
    if (canalId === null || !usuario) return;
    const form = new FormData();
    form.append("canalId", String(canalId));
    form.append("texto", texto);
    if (archivo) form.append("archivo", archivo);
    setEnviando(true);
    try {
      const res = await apiFetch("/api/chat", { method: "POST", body: form });
      const data = await jsonOrNull(res);
      if (data?.mensaje) {
        mutate();
        setTexto("");
        setArchivo(null);
      }
    } finally {
      setEnviando(false);
    }
  }

  if (!canales) return (
    <div className="p-4"><Spinner /></div>
  );

  return (
    <div className="flex h-full" data-oid="chat-page">
      <aside className="w-64 border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-2">Canales</h2>
        <ul>
          {canales.canales.map((c) => (
            <li
              key={c.id}
              className={`cursor-pointer mb-1 ${c.id === canalId ? "font-semibold" : ""}`}
              onClick={() => setCanalId(c.id)}
            >
              #{c.nombre}
            </li>
          ))}
        </ul>
      </aside>
      <section className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {mensajes?.mensajes?.map((m) => (
            <div key={m.id} className="border rounded p-2">
              <div className="text-sm font-semibold">{m.usuario.nombre}</div>
              {m.texto && <p className="text-sm">{m.texto}</p>}
              {m.archivo && (
                <img src={`data:image/*;base64,${m.archivo}`} alt="archivo" className="mt-2 max-h-48" />
              )}
              <div className="text-xs text-gray-500">{new Date(m.fecha).toLocaleString()}</div>
            </div>
          ))}
        </div>
        {canalId !== null && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
            className="border-t p-2 flex items-center space-x-2"
          >
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="flex-1 border rounded p-2"
              placeholder="Escribe un mensaje"
            />
            <input type="file" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
            <button
              type="submit"
              disabled={enviando}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Enviar
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
