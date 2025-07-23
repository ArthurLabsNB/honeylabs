"use client";
import { type Board } from "@/hooks/useBoards";

export default function BoardTab({ tab }: { tab: Board }) {
  return (
    <div className="px-5 py-2 rounded-lg bg-[var(--dashboard-sidebar)] text-white">
      {tab.title}
    </div>
  );
}

