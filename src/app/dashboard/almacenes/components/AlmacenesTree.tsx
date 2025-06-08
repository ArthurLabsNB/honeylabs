"use client";
import type { Almacen } from "@/hooks/useAlmacenes";

export default function AlmacenesTree({ almacenes, onOpen }: { almacenes: Almacen[]; onOpen: (id: number) => void }) {
  return (
    <ul className="list-disc pl-4" data-oid="pbcygko">
      {almacenes.map((a) => (
        <li
          key={a.id}
          className="cursor-pointer hover:underline"
          onClick={() => onOpen(a.id)}
          data-oid="d2wd5ww"
        >
          {a.nombre}
        </li>
      ))}
    </ul>
  );
}
