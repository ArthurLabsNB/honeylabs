"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import QuickInventoryModal from "./QuickInventoryModal";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import { QUICK_INVENTORY_EVENT } from "@/lib/ui-events";

type Inventory = { entradas: number; salidas: number; inventario: number };

export default function AlmacenPage() {
  const { id } = useParams<{ id: string }>();
  const [inv, setInv] = useState<Inventory | null>(null);

  // Reutilizamos un AbortController y abortamos requests anteriores (evita fugas/loops)
  const ctrlRef = useRef<AbortController | null>(null);

  const fetchInv = useCallback(async () => {
    if (!id) return;
    // cancela fetch previo (si estaba en vuelo)
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      const res = await apiFetch(`/api/almacenes/${id}`, { signal: ctrl.signal });
      const d = await jsonOrNull(res);
      if (!ctrl.signal.aborted && d?.almacen) {
        setInv({
          entradas: d.almacen.entradas ?? 0,
          salidas: d.almacen.salidas ?? 0,
          inventario: d.almacen.inventario ?? 0,
        });
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") console.error(err);
    }
  }, [id]);

  // Escucha el evento y sólo reacciona si (a) no hay detail.id o (b) coincide con el id actual
  const onQuickInventory = useCallback(
    (ev: Event) => {
      const ce = ev as CustomEvent<{ id?: string | number }>;
      if (ce?.detail?.id != null && String(ce.detail.id) !== String(id)) return;
      fetchInv();
    },
    [id, fetchInv]
  );

  useEffect(() => {
    window.addEventListener(QUICK_INVENTORY_EVENT, onQuickInventory as EventListener);
    return () => {
      window.removeEventListener(QUICK_INVENTORY_EVENT, onQuickInventory as EventListener);
      ctrlRef.current?.abort();
    };
  }, [onQuickInventory]);

  // No abrimos el modal de inicio: sólo cuando llega el evento se setea `inv`
  return inv ? <QuickInventoryModal data={inv} onClose={() => setInv(null)} /> : null;
}
