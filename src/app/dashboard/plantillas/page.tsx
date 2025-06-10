"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import useSession from "@/hooks/useSession";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";

interface Plantilla {
  id: number;
  nombre: string;
}

export default function PlantillasPage() {
  const allowed = ["admin", "administrador", "institucional", "empresarial", "individual"];
  const { usuario, loading: loadingUsuario } = useSession();
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadingUsuario) return;
    if (!usuario) {
      setError("Debes iniciar sesión");
      return;
    }
    const rol = getMainRole(usuario)?.toLowerCase();
    const tipo = normalizeTipoCuenta(usuario.tipoCuenta);
    if (rol !== "admin" && rol !== "administrador" && !allowed.includes(tipo)) {
      setError("No autorizado");
      return;
    }
    setError("");
  }, [usuario, loadingUsuario]);

  useEffect(() => {
    if (loadingUsuario || !usuario || error) return;
    setLoading(true);
    apiFetch("/api/plantillas")
      .then(jsonOrNull)
      .then((d) => setPlantillas(d.plantillas || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, loadingUsuario, error]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="9_t15sy">
        {error}
      </div>
    );

  if (loading || loadingUsuario)
    return (
      <div className="p-4" data-oid="q5gn5.p">
        <Spinner />
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
