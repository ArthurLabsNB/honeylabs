"use client";

import MaterialesTab from "../components/tabs/MaterialesTab";
import UnidadesTab from "../components/tabs/UnidadesTab";
import AuditoriasTab from "../components/tabs/AuditoriasTab";

export default function WarehouseBoard() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
      <div className="dashboard-card overflow-auto"><MaterialesTab /></div>
      <div className="dashboard-card overflow-auto"><UnidadesTab /></div>
      <div className="dashboard-card overflow-auto"><AuditoriasTab /></div>
    </div>
  );
}
