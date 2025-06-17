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
  tipo: string;
}

export default function PlantillasPage() {
  const allowed = ["admin", "administrador", "institucional", "empresarial", "individual"];
  const { usuario, loading: loadingUsuario } = useSession();
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("publica");
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

  const agregar = async () => {
    const res = await apiFetch("/api/plantillas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo }),
    });
    const data = await jsonOrNull(res);
    if (data?.plantilla) setPlantillas([...plantillas, data.plantilla]);
    setNombre("");
  };

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

  const porTipo = (t: string) => plantillas.filter((p) => p.tipo === t);

  return (
    <div className="p-4 space-y-4" data-oid="incpxl_">
      <h1 className="text-2xl font-bold mb-4" data-oid="ozc.4yr">
        Plantillas
      </h1>
      <div className="flex gap-2 items-end">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-1 rounded"
          placeholder="Nombre"
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border p-1 rounded">
          <option value="publica">Pública</option>
          <option value="privada">Privada</option>
          <option value="comunidad">Comunidad</option>
        </select>
        <button onClick={agregar} className="bg-blue-600 text-white px-3 py-1 rounded">
          Agregar
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { t: "publica", label: "Públicas" },
          { t: "privada", label: "Privadas" },
          { t: "comunidad", label: "Comunidad" },
        ].map(({ t, label }) => (
          <div key={t}>
            <h2 className="font-semibold mb-1">{label}</h2>
            <ul className="list-disc pl-4">
              {porTipo(t).map((p) => (
                <li key={p.id}>{p.nombre}</li>
              ))}
              {!porTipo(t).length && <li className="text-gray-400">Sin plantillas</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
