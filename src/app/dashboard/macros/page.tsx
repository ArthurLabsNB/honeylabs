"use client";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useToast } from "@/components/Toast";

interface Macro { id: string; accion: string; intervalo: number; }

const acciones = [
  "limpiar pizarra",
  "exportar",
  "notificar cambio",
];

export default function MacrosPage() {
  const [lista, setLista] = useState<Macro[]>([]);
  const [accion, setAccion] = useState(acciones[0]);
  const [intervalo, setIntervalo] = useState(60);
  const { show } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("macros");
    if (saved) setLista(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("macros", JSON.stringify(lista));
  }, [lista]);

  useEffect(() => {
    const timers = lista.map((m) =>
      setInterval(() => show(`Macro: ${m.accion}`, 'info'), m.intervalo * 1000),
    );
    return () => timers.forEach(clearInterval);
  }, [lista]);

  const agregar = () => {
    setLista([...lista, { id: nanoid(), accion, intervalo }]);
  };

  const borrar = (id: string) => setLista(lista.filter((m) => m.id !== id));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Macros</h1>
      <div className="flex gap-2 items-end">
        <select
          value={accion}
          onChange={(e) => setAccion(e.target.value)}
          className="border p-1 rounded"
        >
          {acciones.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <input
          type="number"
          value={intervalo}
          onChange={(e) => setIntervalo(Number(e.target.value))}
          className="border p-1 w-20 rounded"
        />
        <button onClick={agregar} className="bg-blue-600 text-white px-3 py-1 rounded">
          Agregar
        </button>
      </div>
      <ul className="list-disc pl-4">
        {lista.map((m) => (
          <li key={m.id} className="flex items-center gap-2">
            <span>
              {m.accion} cada {m.intervalo}s
            </span>
            <button onClick={() => borrar(m.id)} className="text-red-600 underline text-xs">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
