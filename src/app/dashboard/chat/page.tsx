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

  const query = new URLSearchParams();
  if (q) query.set('q', q);
  if (desde) query.set('desde', desde);
  if (hasta) query.set('hasta', hasta);
  if (tipo !== 'todos') query.set('tipo', tipo);

  const { data: mensajes, mutate } = useSWR<{
    mensajes: MensajeChat[];
  }>(
    canalId !== null ? `/api/chat?canalId=${canalId}&${query.toString()}` : null,
    jsonOrNull,
  );

  const [q, setQ] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [tipo, setTipo] = useState("todos");

  const [showInfo, setShowInfo] = useState(false);

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
      <section className="flex-1 flex flex-col relative">
        <div className="p-4 border-b flex flex-wrap gap-2 items-end">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border rounded p-1 flex-1 min-w-32"
            placeholder="Buscar"
          />
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border rounded p-1"
          />
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border rounded p-1"
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border rounded p-1"
          >
            <option value="todos">Todos</option>
            <option value="texto">Solo texto</option>
            <option value="archivo">Con archivos</option>
          </select>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => mutate()}
          >
            Buscar
          </button>
        </div>
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
        <button
          className="absolute top-2 right-2 text-sm underline"
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? "Ocultar" : "Info"}
        </button>
        {showInfo && usuario && (
          <div className="absolute top-8 right-2 w-60 border bg-white p-2 rounded shadow">
            <h3 className="font-semibold mb-1">{usuario.nombre}</h3>
            <p className="text-xs">{usuario.correo}</p>
          </div>
        )}
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
