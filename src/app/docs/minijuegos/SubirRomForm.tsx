"use client";
import { useState } from "react";
import { apiFetch } from "@lib/api";

interface Props {
  onUpload: () => void;
}

export default function SubirRomForm({ onUpload }: Props) {
  const [nombre, setNombre] = useState("");
  const [plataforma, setPlataforma] = useState("gba");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!archivo) return;
    const form = new FormData();
    form.append("nombre", nombre);
    form.append("plataforma", plataforma);
    form.append("archivo", archivo);
    const res = await apiFetch("/api/minijuegos/upload", { method: "POST", body: form });
    if (res.ok) {
      setNombre("");
      setArchivo(null);
      setMensaje("Subido");
      onUpload();
    } else {
      setMensaje("Error al subir");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        className="border p-1 rounded w-full text-black"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <select
        className="border p-1 rounded w-full text-black"
        value={plataforma}
        onChange={(e) => setPlataforma(e.target.value)}
      >
        <option value="gba">GBA</option>
        <option value="nes">NES</option>
      </select>
      <input
        type="file"
        accept=".gba,.nes"
        onChange={(e) => setArchivo(e.target.files?.[0] || null)}
      />
      <button className="px-3 py-1 bg-miel text-[#22223b] rounded">Subir</button>
      {mensaje && <p className="text-xs">{mensaje}</p>}
    </form>
  );
}
