"use client";
import { Plus } from "lucide-react";
import { generarUUID } from "@/lib/uuid";
import { useBoardStore } from "@/hooks/useBoards";

export default function AddBoardButton() {
  const { add } = useBoardStore();

  const create = () => {
    add({ id: generarUUID(), title: "New Tab" });
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

