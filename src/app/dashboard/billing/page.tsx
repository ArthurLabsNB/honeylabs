"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";

interface Usuario {
  rol?: string;
  tipoCuenta?: string;
}
interface Invoice {
  id: number;
  concepto: string;
  monto: number;
  estado: string;
}

export default function BillingPage() {
  const allowed = ["admin", "institucional"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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
    fetch("/api/billing")
      .then(jsonOrNull)
      .then((d) => setInvoices(d.invoices || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="ndevmu0">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="p-4" data-oid="nl1s5nf">
        Cargando...
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
