"use client";
import { useState } from "react";
import type { Material } from "../components/MaterialRow";

interface Props {
  material: Material | null;
  onChange: (campo: keyof Material, valor: Material[keyof Material]) => void;
}

export default function UnidadesPanel({ material, onChange }: Props) {
  const [value, setValue] = useState("");
  const [items, setItems] = useState<string[]>([]);

  const add = () => {
    const v = value.trim();
    if (v && !items.includes(v)) {
      setItems((arr) => [...arr, v]);
      setValue("");
      onChange("unidad", v);
    }
  };

  const select = (u: string) => {
    onChange("unidad", u);
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
        {items.map((u) => (
          <li
            key={u}
            onClick={() => select(u)}
            className={`p-1 rounded-md cursor-pointer ${
              material?.unidad === u
                ? 'bg-[var(--dashboard-accent)] text-black'
                : 'bg-white/5'
            }`}
          >
            {u}
          </li>
        ))}
      </ul>
    </div>
  );
}
