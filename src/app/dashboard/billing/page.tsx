"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import useSession from "@/hooks/useSession";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";

interface Invoice {
  id: number;
  concepto: string;
  monto: number;
  estado: string;
}

export default function BillingPage() {
  const allowed = ["admin", "administrador", "institucional"];
  const { usuario, loading: loadingUsuario } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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
    apiFetch("/api/billing")
      .then(jsonOrNull)
      .then((d) => setInvoices(d.invoices || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, loadingUsuario, error]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="ndevmu0">
        {error}
      </div>
    );

  if (loading || loadingUsuario)
    return (
      <div className="p-4" data-oid="nl1s5nf">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4" data-oid="t5lti-w">
      <h1 className="text-2xl font-bold mb-4" data-oid="rf_rc_.">
        Billing
      </h1>
      <ul className="list-disc pl-4" data-oid="n_816z3">
        {invoices.map((i) => (
          <li key={i.id} data-oid="hxxqwhx">
            {i.concepto} - ${"{i.monto}"} ({i.estado})
          </li>
        ))}
      </ul>
    </div>
  );
}
