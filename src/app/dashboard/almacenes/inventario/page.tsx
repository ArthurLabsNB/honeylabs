"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import useSession from "@/hooks/useSession";
import useAlmacenes from "@/hooks/useAlmacenes";
import useMateriales from "@/hooks/useMateriales";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";

export interface Alerta {
  id: number;
  titulo: string;
  mensaje: string;
  prioridad: string;
  fecha: string;
  almacen: { nombre: string };
}

export async function exportCSV(tipo: "material" | "almacen" | "unidad") {
  const res = await apiFetch(`/api/archivos/export?tipo=${tipo}&formato=csv`);
  if (!res.ok) return;
  const blob = await res.blob();
  if (typeof document !== "undefined") {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tipo}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}

export async function bulkUpdateStocks(updates: { id: number; cantidad: number }[]) {
  return Promise.all(
    updates.map((u) =>
      apiFetch(`/api/materiales/${u.id}/ajuste`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad: u.cantidad }),
      }).then(jsonOrNull),
    ),
  );
}

export async function generateQRBatch(almacenId: number, cantidad: number) {
  const codigos: string[] = [];
  for (let i = 0; i < cantidad; i++) {
    const res = await apiFetch("/api/codigos/generar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ almacenId, rolAsignado: "lectura" }),
    });
    const data = await jsonOrNull(res);
    if (res.ok && data?.codigo) codigos.push(data.codigo as string);
  }
  return codigos;
}

export default function InventarioPage() {
  const { usuario } = useSession();
  const { almacenes } = useAlmacenes(
    usuario ? { usuarioId: usuario.id } : undefined,
  );
  const [almacenId, setAlmacenId] = useState<number | null>(null);
  const {
    materiales,
    isLoading: loadingMateriales,
  } = useMateriales(almacenId ?? undefined);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"nombre" | "cantidad">("nombre");
  const [csvTipo, setCsvTipo] = useState<"material" | "almacen" | "unidad">(
    "material",
  );
  const [bulkIds, setBulkIds] = useState("");
  const [bulkCantidad, setBulkCantidad] = useState("");
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [qrAlmacenId, setQrAlmacenId] = useState("");
  const [qrCantidad, setQrCantidad] = useState(1);

  const loadAlertas = useCallback(
    async (aid?: number | null) => {
      if (!usuario) return;
      const params = new URLSearchParams({ usuarioId: String(usuario.id) });
      if (aid) params.set("almacenId", String(aid));
      const res = await apiFetch(`/api/alertas?${params.toString()}`);
      const data = await jsonOrNull(res);
      if (res.ok && data?.alertas) setAlertas(data.alertas as Alerta[]);
    },
    [usuario],
  );

  useEffect(() => {
    loadAlertas(almacenId);
  }, [loadAlertas, almacenId]);

  const filtrados = useMemo(
    () =>
      materiales
        .filter((m) => (m?.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()))
        .sort((a, b) =>
          orden === "nombre"
            ? a.nombre.localeCompare(b.nombre)
            : a.cantidad - b.cantidad,
        ),
    [materiales, busqueda, orden],
  );

  const aplicarBulk = async () => {
    const ids = bulkIds
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((n) => !Number.isNaN(n));
    const cant = Number(bulkCantidad);
    if (!ids.length || Number.isNaN(cant)) return;
    await bulkUpdateStocks(ids.map((id) => ({ id, cantidad: cant })));
    setBulkIds('');
    setBulkCantidad('');
  };

  const generar = async () => {
    const aid = Number(qrAlmacenId);
    if (Number.isNaN(aid) || qrCantidad <= 0) return;
    const cods = await generateQRBatch(aid, qrCantidad);
    if (cods.length) alert(cods.join('\n'));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Inventario</h1>
      <select
        value={almacenId ?? ""}
        onChange={(e) => setAlmacenId(Number(e.target.value) || null)}
        className="p-2 border rounded-md"
      >
        <option value="">Selecciona almacén</option>
        {almacenes.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nombre}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar"
          className="flex-1 p-2 border rounded-md"
        />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value as any)}
          className="p-2 border rounded-md"
        >
          <option value="nombre">Nombre</option>
          <option value="cantidad">Cantidad</option>
        </select>
      </div>
      {loadingMateriales ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full text-sm bg-white/5 rounded-md overflow-hidden">
          <thead className="bg-white/10">
            <tr>
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2 text-left">Cantidad</th>
              <th className="px-3 py-2 text-left">Lote</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m) => (
              <tr key={m.id} className="border-t border-white/10">
                <td className="px-3 py-2">{m.nombre}</td>
                <td className="px-3 py-2">{m.cantidad}</td>
                <td className="px-3 py-2">{m.lote}</td>
                <td className="px-3 py-2">{m.estado}</td>
                <td className="px-3 py-2">{m.ubicacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <section className="space-y-2">
        <h2 className="font-bold">Exportar a CSV</h2>
        <div className="flex gap-2">
          <select
            value={csvTipo}
            onChange={(e) => setCsvTipo(e.target.value as any)}
            className="p-2 border rounded"
          >
            <option value="material">Materiales</option>
            <option value="unidad">Unidades</option>
            <option value="almacen">Almacenes</option>
          </select>
          <button
            onClick={() => exportCSV(csvTipo)}
            className="px-3 py-1 bg-[var(--dashboard-accent)] text-white rounded"
          >
            Exportar
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Actualización masiva</h2>
        <input
          value={bulkIds}
          onChange={(e) => setBulkIds(e.target.value)}
          placeholder="IDs separados por coma"
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          value={bulkCantidad}
          onChange={(e) => setBulkCantidad(e.target.value)}
          placeholder="Nuevo stock"
          className="p-2 border rounded w-full"
        />
        <button
          onClick={aplicarBulk}
          className="px-3 py-1 bg-[var(--dashboard-accent)] text-white rounded"
        >
          Aplicar
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Alertas de bajo stock</h2>
        <button onClick={() => loadAlertas(almacenId)} className="px-3 py-1 border rounded">
          Refrescar
        </button>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {alertas.map((a) => (
            <li key={a.id}>
              {a.titulo} - {a.almacen.nombre}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Generación de QR por lote</h2>
        <select
          value={qrAlmacenId}
          onChange={(e) => setQrAlmacenId(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">Almacén</option>
          {almacenes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={qrCantidad}
          onChange={(e) => setQrCantidad(Number(e.target.value))}
          placeholder="Cantidad"
          className="p-2 border rounded w-full"
        />
        <button
          onClick={generar}
          className="px-3 py-1 bg-[var(--dashboard-accent)] text-white rounded"
        >
          Generar
        </button>
      </section>
    </div>
  );
}
