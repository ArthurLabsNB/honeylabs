"use client";
import { useState, useEffect } from "react";
import useInventoryTools from "./useInventoryTools";

export default function UtilidadesPage() {
  const { alertas, loadAlertas, exportarCSV, bulkUpdate, generarQR } = useInventoryTools();
  const [csvTipo, setCsvTipo] = useState<'material' | 'almacen' | 'unidad'>('material');
  const [bulkIds, setBulkIds] = useState('');
  const [bulkCantidad, setBulkCantidad] = useState('');
  const [almacenId, setAlmacenId] = useState('');
  const [qrCantidad, setQrCantidad] = useState(1);

  useEffect(() => { loadAlertas(); }, [loadAlertas]);

  const aplicarBulk = async () => {
    const ids = bulkIds.split(',').map(id => Number(id.trim())).filter(n => !Number.isNaN(n));
    const cant = Number(bulkCantidad);
    if (!ids.length || Number.isNaN(cant)) return;
    await bulkUpdate(ids.map(id => ({ id, cantidad: cant })));
    setBulkIds('');
    setBulkCantidad('');
  };

  const generar = async () => {
    const aid = Number(almacenId);
    if (Number.isNaN(aid) || qrCantidad <= 0) return;
    const cods = await generarQR(aid, qrCantidad);
    if (cods.length) alert(cods.join("\n"));
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Utilidades de Inventario</h1>

      <section className="space-y-2">
        <h2 className="font-bold">Exportar a CSV</h2>
        <div className="flex gap-2">
          <select
            value={csvTipo}
            onChange={e => setCsvTipo(e.target.value as any)}
            className="p-2 border rounded"
          >
            <option value="material">Materiales</option>
            <option value="unidad">Unidades</option>
            <option value="almacen">Almacenes</option>
          </select>
          <button
            onClick={() => exportarCSV(csvTipo)}
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
          onChange={e => setBulkIds(e.target.value)}
          placeholder="IDs separados por coma"
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          value={bulkCantidad}
          onChange={e => setBulkCantidad(e.target.value)}
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
        <button onClick={loadAlertas} className="px-3 py-1 border rounded">
          Refrescar
        </button>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {alertas.map(a => (
            <li key={a.id}>{a.titulo} - {a.almacen.nombre}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Generación de QR por lote</h2>
        <input
          type="number"
          value={almacenId}
          onChange={e => setAlmacenId(e.target.value)}
          placeholder="Almacén ID"
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          value={qrCantidad}
          onChange={e => setQrCantidad(Number(e.target.value))}
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
