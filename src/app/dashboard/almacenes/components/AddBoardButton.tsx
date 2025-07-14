"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { generarUUID } from "@/lib/uuid";
import { useBoardStore } from "@/hooks/useBoards";
import { usePrompt } from "@/hooks/usePrompt";

export default function AddBoardButton() {
  const { add } = useBoardStore();
  const [adding, setAdding] = useState(false);
  const prompt = usePrompt();

  const create = async () => {
    setAdding(true);
    const title = await prompt("Nombre del tablero");
    setAdding(false);
    if (!title) return;
    add({ id: generarUUID(), title });
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

