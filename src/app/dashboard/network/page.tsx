"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";

interface Usuario {
  rol?: string;
  tipoCuenta?: string;
}
interface Peer {
  id: number;
  nombre: string;
}

export default function NetworkPage() {
  const allowed = ["admin", "institucional"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
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
    fetch("/api/network")
      .then(jsonOrNull)
      .then((d) => setPeers(d.peers || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="q79cbuw">
        {error}
      </div>
    );
  if (loading)
    return (
      <div className="p-4" data-oid="o1d167d">
        Cargando...
      </div>
    );

  return (
    <div className="p-4" data-oid="network-page">
      <h1 className="text-2xl font-bold mb-4" data-oid="0:feqgr">
        Network
      </h1>
      <ul className="list-disc pl-4" data-oid="igr3o9f">
        {peers.map((p) => (
          <li key={p.id} data-oid="jw5.iwq">
            {p.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
