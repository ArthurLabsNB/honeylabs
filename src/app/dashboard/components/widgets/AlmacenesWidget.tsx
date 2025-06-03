"use client";
import React from "react";

export default function AlmacenesWidget({ usuario }: { usuario: any }) {
  // Aquí puedes hacer fetch a almacenes reales según el usuario
  return (
    <div data-oid="ieoan:w">
      <span className="font-semibold" data-oid="007fl55">
        Almacenes conectados:
      </span>{" "}
      <span className="text-amber-400 font-bold" data-oid="otwl3f8">
        4
      </span>
      {/* Cambia por tu lógica real */}
    </div>
  );
}
