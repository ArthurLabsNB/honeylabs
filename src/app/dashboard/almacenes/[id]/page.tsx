"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuickInventoryModal from "./QuickInventoryModal";
import { jsonOrNull } from "@lib/http";

export default function AlmacenPage() {
  const { id } = useParams();
  const [inv, setInv] = useState<{ entradas: number; salidas: number; inventario: number } | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => {
      fetch(`/api/almacenes/${id}`)
        .then(jsonOrNull)
        .then((d) => {
          if (d?.almacen) {
            setInv({
              entradas: d.almacen.entradas ?? 0,
              salidas: d.almacen.salidas ?? 0,
              inventario: d.almacen.inventario ?? 0,
            });
            setShow(true);
          }
        })
        .catch(() => {});
    };
    window.addEventListener("quick-inventory", handler);
    return () => window.removeEventListener("quick-inventory", handler);
  }, [id]);

  return show && inv ? <QuickInventoryModal data={inv} onClose={() => setShow(false)} /> : null;
}
