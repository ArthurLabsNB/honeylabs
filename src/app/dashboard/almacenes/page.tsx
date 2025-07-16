"use client";
import { useRouter } from "next/navigation";
import { useAlmacenesUI } from "./ui";
import { hasManagePerms } from "@lib/permisos";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import useAlmacenesLogic from "@/hooks/useAlmacenesLogic";
import type { Almacen } from "@/hooks/useAlmacenes";
import FloatingAddMenu from "./components/FloatingAddMenu";
import AlmacenesList from "./components/AlmacenesList";
import AlmacenesGrid from "./components/AlmacenesGrid";
import AlmacenesTree from "./components/AlmacenesTree";

export default function AlmacenesPage() {
  const router = useRouter();
  const { view } = useAlmacenesUI();
  const {
    usuario,
    almacenes,
    favoritos,
    loading,
    error,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    moveItem,
    eliminar,
    duplicar,
    toggleFavorito,
  } = useAlmacenesLogic();

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="u6cxvra">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="p-4" data-oid="8xwpkrd">
        <Spinner />
      </div>
    );


  if (almacenes.length === 0)
    return (
      <div className="p-4" data-oid="j7.ylhr">
        {usuario && (
          <EmptyState allowCreate={hasManagePerms(usuario)} />
        )}
        {usuario && hasManagePerms(usuario) && <FloatingAddMenu />}
      </div>
    );

  return (
    <div className="p-4 relative" data-oid="j7.ylhr">
      {view === "list" ? (
        <AlmacenesList
          almacenes={almacenes}
          favoritos={favoritos}
          onToggleFavorito={toggleFavorito}
          onEdit={(id) => router.push(`/dashboard/almacenes/${id}/editar`)}
          onDelete={eliminar}
          onOpen={(id) => router.push(`/dashboard/almacenes/${id}`)}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onMove={(id, dir) => moveItem(id, dir)}
        />
      ) : view === "grid" ? (
        <AlmacenesGrid
          almacenes={almacenes}
          favoritos={favoritos}
          onToggleFavorito={toggleFavorito}
          onEdit={(id) => router.push(`/dashboard/almacenes/${id}/editar`)}
          onDelete={eliminar}
          onDuplicate={async (id) => {
            const nuevo = await duplicar(id)
            if (nuevo) router.push(`/dashboard/almacenes/${nuevo}`)
          }}
          onOpen={(id) => router.push(`/dashboard/almacenes/${id}`)}
        />
      ) : (
        <AlmacenesTree
          almacenes={almacenes}
          onOpen={(id) => router.push(`/dashboard/almacenes/${id}`)}
        />
      )}
      {usuario && hasManagePerms(usuario) && <FloatingAddMenu />}
    </div>
  );
}

