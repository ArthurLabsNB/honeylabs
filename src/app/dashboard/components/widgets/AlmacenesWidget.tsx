"use client";
import React from "react";

export default function AlmacenesWidget({ usuario }: { usuario: any }) {
  // Aquí puedes hacer fetch a almacenes reales según el usuario
  return (
    <div data-oid="dl_tfcd">
      <span className="font-semibold" data-oid="2xwvb0_">
        Almacenes conectados:
      </span>{" "}
      <span className="text-amber-400 font-bold" data-oid="pyapf67">
        4
      </span>
      {/* Cambia por tu lógica real */}
    </div>
  );
}
