"use client";
import React from "react";

export default function NovedadesWidget({ usuario }: { usuario: any }) {
  // Aquí fetch real a eventos/novedades
  return (
    <div data-oid="59-4z-x">
      <span className="font-semibold" data-oid="--5bxhz">
        Próximos eventos:
      </span>
      <ul className="list-disc pl-5 mt-1" data-oid="js2p-jv">
        <li data-oid="rvz8z3q">Visita programada mañana</li>
        <li data-oid="uyhs--9">Inventario trimestral</li>
      </ul>
    </div>
  );
}
