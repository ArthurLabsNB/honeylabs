"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import type { Usuario } from "@/types/usuario";

interface Plantilla {
  id: number;
  nombre: string;
}

export default function PlantillasPage() {
  const allowed = ["admin", "institucional", "empresarial", "estandar"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((data) => {
        if (!data?.success) throw new Error();
        const tipo =
          data.usuario.rol === "admin"
            ? "admin"
            : (data.usuario.tipoCuenta ?? "estandar");
        if (!allowed.includes(tipo)) throw new Error("No autorizado");
        setUsuario(data.usuario);
      })
      .catch((err) => setError(err.message || "Debes iniciar sesión"));
  }, []);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    fetch("/api/plantillas")
      .then(jsonOrNull)
      .then((d) => setPlantillas(d.plantillas || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="9_t15sy">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="p-4" data-oid="q5gn5.p">
        Cargando...
      </div>
    );

  return (
    <div className="p-4" data-oid="incpxl_">
      <h1 className="text-2xl font-bold mb-4" data-oid="ozc.4yr">
        Plantillas
      </h1>
      <ul className="list-disc pl-4" data-oid="nwulz9t">
        {plantillas.map((p) => (
          <li key={p.id} data-oid="f0gjqh:">
            {p.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
