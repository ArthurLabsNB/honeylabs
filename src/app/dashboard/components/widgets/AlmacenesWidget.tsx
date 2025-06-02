"use client";
import React from "react";

export default function AlmacenesWidget({ usuario }: { usuario: any }) {
  // Aquí puedes hacer fetch a almacenes reales según el usuario
  return (
    <div>
      <span className="font-semibold">Almacenes conectados:</span>{" "}
      <span className="text-amber-400 font-bold">4</span>
      {/* Cambia por tu lógica real */}
    </div>
  );
}
