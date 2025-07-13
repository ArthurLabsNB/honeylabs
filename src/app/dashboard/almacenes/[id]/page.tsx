"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuickInventoryModal from "./QuickInventoryModal";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import { QUICK_INVENTORY_EVENT } from "@/lib/ui-events";

interface Inventory {
  entradas: number;
  salidas: number;
  inventario: number;
}

export default function AlmacenPage() {
  const { id } = useParams<{ id: string }>();
  const [inv, setInv] = useState<Inventory | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const fetchInv = () =>
      apiFetch(`/api/almacenes/${id}`, { signal: ctrl.signal })
        .then(jsonOrNull)
        .then((d) => {
          if (d?.almacen) {
            setInv({
              entradas: d.almacen.entradas ?? 0,
              salidas: d.almacen.salidas ?? 0,
              inventario: d.almacen.inventario ?? 0,
            });
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });

    window.addEventListener(QUICK_INVENTORY_EVENT, fetchInv as EventListener);
    return () => {
      ctrl.abort();
      window.removeEventListener(QUICK_INVENTORY_EVENT, fetchInv as EventListener);
    };
  }, [id]);

  return inv && <QuickInventoryModal data={inv} onClose={() => setInv(null)} />;
}
