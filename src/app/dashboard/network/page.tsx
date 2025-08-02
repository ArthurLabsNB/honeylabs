"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import { getMainRole, normalizeRol, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";

interface Peer {
  id: number;
  nombre: string;
}

export default function NetworkPage() {
  const allowed = ["admin", "administrador", "institucional"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/login")
      .then(jsonOrNull)
      .then((data) => {
        if (!data?.success) throw new Error();
        const _role = getMainRole(data.usuario);
        const rol = normalizeRol(
          typeof _role === "string" ? _role : _role?.nombre,
        );
        const tipo = normalizeTipoCuenta(data.usuario.tipoCuenta);
        if (rol !== "admin" && rol !== "administrador" && !allowed.includes(tipo))
          throw new Error("No autorizado");
        setUsuario(data.usuario);
      })
      .catch((err) => setError(err.message || "Debes iniciar sesión"));
  }, []);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    apiFetch("/api/network")
      .then(jsonOrNull)
      .then((d) => setPeers(d.peers || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="3xwy1c8">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="p-4" data-oid="vzjk3mh">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4" data-oid="gzpj357">
      <h1 className="text-2xl font-bold mb-4" data-oid="wdv6f.t">
        Network
      </h1>
      <ul className="list-disc pl-4" data-oid="o_bywsp">
        {peers.map((p) => (
          <li key={p.id} data-oid="ad3e678">
            {p.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
