"use client";
import type { Factura } from "@/types/billing";
interface Props { facturas: Factura[] }
export default function InvoiceHistory({ facturas }: Props) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="text-left">Folio</th>
          <th className="text-left">Fecha</th>
          <th className="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {facturas.map((f) => (
          <tr key={f.id} className="border-t">
            <td>{f.folio}</td>
            <td>{new Date(f.fechaEmision ?? '').toLocaleDateString()}</td>
            <td className="text-right">${f.total?.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
