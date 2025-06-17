"use client";

interface Nodo {
  id: string;
  nombre: string;
  hijos?: Nodo[];
}

const datos: Nodo[] = [
  {
    id: "1",
    nombre: "Proyecto",
    hijos: [
      { id: "1-1", nombre: "Diseño" },
      {
        id: "1-2",
        nombre: "Implementación",
        hijos: [
          { id: "1-2-1", nombre: "Frontend" },
          { id: "1-2-2", nombre: "Backend" },
        ],
      },
    ],
  },
];

function NodoVista({ nodo }: { nodo: Nodo }) {
  return (
    <li className="ml-4 list-disc">
      <span>{nodo.nombre}</span>
      {nodo.hijos && (
        <ul>
          {nodo.hijos.map((h) => (
            <NodoVista key={h.id} nodo={h} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function DependenciasPage() {
  return (
    <div className="p-4 space-y-4" data-oid="tree-root">
      <h1 className="text-2xl font-bold">Árbol de Dependencias</h1>
      <ul>
        {datos.map((n) => (
          <NodoVista key={n.id} nodo={n} />
        ))}
      </ul>
    </div>
  );
}
