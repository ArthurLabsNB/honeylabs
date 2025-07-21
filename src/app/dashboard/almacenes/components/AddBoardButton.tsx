"use client";
import { Plus } from "lucide-react";
import { generarUUID } from "@/lib/uuid";
import { apiFetch } from "@lib/api";
import { useBoardStore } from "@/hooks/useBoards";
import { useTabStore } from "@/hooks/useTabs";
import { useCreateTab } from "@/hooks/useCreateTab";

export default function AddBoardButton() {
  const { add } = useBoardStore();
  const { create: addMateriales } = useCreateTab({
    defaultLayout: { side: 'right', x: 1, y: 0, h: 2 },
  });
  const { create: addUnidades } = useCreateTab({
    defaultLayout: { side: 'right', x: 1, y: 2 },
  });
  const { create: addAuditorias } = useCreateTab({
    defaultLayout: { side: 'right', x: 2, y: 2 },
  });
  const { create: addForm } = useCreateTab({
    defaultLayout: { side: 'left', x: 0, y: 0, h: 3 },
  });

  const create = async () => {
    const id = generarUUID();
    add({ id, title: 'New Tab' });
    await addMateriales('materiales', 'Materiales');
    await addUnidades('unidades', 'Unidades');
    await addAuditorias('auditorias', 'Auditorias');
    await addForm('form-material', 'Material');
    const boardTabs = useTabStore
      .getState()
      .tabs.filter((t) => t.boardId === id);
    apiFetch('/api/dashboard/layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [id]: boardTabs }),
    }).catch(() => {});
  };

  return (
    <button
      onClick={create}
      title="Nueva pestaña"
      className="p-1 hover:bg-white/20 rounded"
    >
      <Plus className="w-4 h-4" />
    </button>
  );
}

