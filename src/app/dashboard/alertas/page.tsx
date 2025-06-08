"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import type { Usuario } from "@/types/usuario";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";

interface Alerta {
  id: number;
  mensaje: string;
  almacen?: { nombre: string };
}

export default function AlertasPage() {
  const allowed = ["admin", "administrador", "institucional", "empresarial", "individual"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((data) => {
        if (!data?.success) throw new Error();
        const rol = getMainRole(data.usuario)?.toLowerCase();
        const tipo = normalizeTipoCuenta(data.usuario.tipoCuenta);
        if (rol !== "admin" && rol !== "administrador" && !allowed.includes(tipo)) {
          throw new Error("No autorizado");
        }
        setUsuario(data.usuario);
      })
      .catch((err) => {
        setError(err.message || "Debes iniciar sesión");
      });
  }, []);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    fetch(`/api/alertas?usuarioId=${usuario.id}`)
      .then(jsonOrNull)
      .then((data) => setAlertas(data.alertas || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="p2cyotw">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="p-4" data-oid="7wfx.vn">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4" data-oid="6lccpiv">
      <h1 className="text-2xl font-bold mb-4" data-oid="hh6pizz">
        Alertas
      </h1>
      <ul className="list-disc pl-4" data-oid="x9u-7rb">
        {alertas.map((a) => (
          <li key={a.id} data-oid="sspv70h">
            {a.almacen ? `${a.almacen.nombre}: ` : ""}
            {a.mensaje}
          </li>
        ))}
      </ul>
    </div>
  );
}
