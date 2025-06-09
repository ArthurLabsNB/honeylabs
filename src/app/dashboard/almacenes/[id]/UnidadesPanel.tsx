"use client";
import { useState } from "react";
import type { Material } from "../components/MaterialRow";
import useUnidades from "@/hooks/useUnidades";

interface Props {
  material: Material | null;
  onChange: (campo: keyof Material, valor: Material[keyof Material]) => void;
}

export default function UnidadesPanel({ material, onChange }: Props) {
  const [value, setValue] = useState("");
  const { unidades, crear, eliminar } = useUnidades(material?.dbId);

  const add = async () => {
    const v = value.trim();
    if (v) {
      await crear(v);
      setValue("");
      onChange("unidad", v);
    }
  };

  const select = (u: string) => {
    onChange("unidad", u);
  };

  const remove = async (id: number) => {
    await eliminar(id);
  };

  return (
    <div className="p-4 border rounded-md space-y-2">
      <h2 className="font-semibold">Unidades</h2>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nueva"
          className="flex-1 p-1 rounded-md bg-white/5 focus:outline-none"
        />
        <button
          onClick={add}
          className="px-2 rounded-md bg-[var(--dashboard-accent)] text-black text-sm"
        >
          Agregar
        </button>
      </div>
      <ul className="space-y-1 max-h-32 overflow-y-auto">
        {unidades.map((u) => (
          <li
            key={u.id}
            className={`p-1 rounded-md cursor-pointer flex justify-between ${
              material?.unidad === u.nombre
                ? 'bg-[var(--dashboard-accent)] text-black'
                : 'bg-white/5'
            }`}
          >
            <span onClick={() => select(u.nombre)}>{u.nombre}</span>
            <button onClick={() => remove(u.id)} className="ml-2 text-xs">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
