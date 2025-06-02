"use client";
import React from "react";

export default function NovedadesWidget({ usuario }: { usuario: any }) {
  // Aquí fetch real a eventos/novedades
  return (
    <div>
      <span className="font-semibold">Próximos eventos:</span>
      <ul className="list-disc pl-5 mt-1">
        <li>Visita programada mañana</li>
        <li>Inventario trimestral</li>
      </ul>
    </div>
  );
}
