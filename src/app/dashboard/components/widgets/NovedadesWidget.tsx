"use client";
import React from "react";

export default function NovedadesWidget({ usuario }: { usuario: any }) {
  // Aquí fetch real a eventos/novedades
  return (
    <div data-oid="6836l6u">
      <span className="font-semibold" data-oid="cjjvn45">
        Próximos eventos:
      </span>
      <ul className="list-disc pl-5 mt-1" data-oid="wcoxf30">
        <li data-oid=":2n:-mi">Visita programada mañana</li>
        <li data-oid="fzdq.1m">Inventario trimestral</li>
      </ul>
    </div>
  );
}
