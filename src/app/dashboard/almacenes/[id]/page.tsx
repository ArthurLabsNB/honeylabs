"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuickInventoryModal from "./QuickInventoryModal";
import { jsonOrNull } from "@lib/http";

const EVENT = "quick-inventory";

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
      fetch(`/api/almacenes/${id}`, { signal: ctrl.signal })
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

    window.addEventListener(EVENT, fetchInv);
    return () => {
      ctrl.abort();
      window.removeEventListener(EVENT, fetchInv);
    };
  }, [id]);

  return inv && <QuickInventoryModal data={inv} onClose={() => setInv(null)} />;
}
