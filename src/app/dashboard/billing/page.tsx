"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import type { Factura } from "@/types/billing";
import useSession from "@/hooks/useSession";
import { getMainRole, normalizeRol, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";
import BillingFilters from "./components/BillingFilters";
import InvoiceGraph from "./components/InvoiceGraph";
import InvoiceHistory from "./components/InvoiceHistory";


export default function BillingPage() {
  const allowed = ["admin", "administrador", "institucional"];
  const { usuario, loading: loadingUsuario } = useSession();
  const [invoices, setInvoices] = useState<Factura[]>([]);
  const [filtered, setFiltered] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadingUsuario) return;
    if (!usuario) {
      setError("Debes iniciar sesión");
      return;
    }
    const _role = getMainRole(usuario);
    const rol = normalizeRol(
      typeof _role === "string" ? _role : _role?.nombre,
    );
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
      .then((d) => {
        setInvoices(d.facturas || [])
        setFiltered(d.facturas || [])
      })
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
      <BillingFilters
        onChange={(q) =>
          setFiltered(
            invoices.filter((f) => f.folio?.toLowerCase().includes(q.toLowerCase())),
          )
        }
      />
      <InvoiceGraph data={filtered.map((f) => ({ fecha: f.fechaEmision ?? '', total: f.total ?? 0 }))} />
      <InvoiceHistory facturas={filtered} />
    </div>
  );
}
