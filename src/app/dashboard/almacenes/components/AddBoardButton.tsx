"use client";
import { Plus } from "lucide-react";

export default function AddBoardButton() {
  return (
    <button title="Nueva pestaña" className="p-1 hover:bg-white/20 rounded">
      <Plus className="w-4 h-4" />
    </button>
  );
}

