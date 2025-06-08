"use client";
export default function AyudaPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Ayuda</h1>
      <p>Atajos de teclado disponibles en la lista de almacenes:</p>
      <ul className="list-disc pl-4 space-y-1">
        <li>Flecha arriba y flecha abajo para cambiar la posición del almacén.</li>
        <li>Enter abre el almacén seleccionado.</li>
      </ul>
    </div>
  );
}
