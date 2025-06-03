"use client";
import React from "react";

export default function NovedadesWidget({ usuario }: { usuario: any }) {
  // Aquí fetch real a eventos/novedades
  return (
    <div data-oid="7h44f8l">
      <span className="font-semibold" data-oid="8i4gclv">
        Próximos eventos:
      </span>
      <ul className="list-disc pl-5 mt-1" data-oid="-ql:w3k">
        <li data-oid="uc0fci8">Visita programada mañana</li>
        <li data-oid="f3j_d_2">Inventario trimestral</li>
      </ul>
    </div>
  );
}
