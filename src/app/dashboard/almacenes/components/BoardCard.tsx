"use client";
import CardBoard from "./CardBoard";
import { BoardProvider } from "../board/BoardProvider";

export default function BoardCard({ board }: { board?: string }) {
  return (
    <BoardProvider>
      <CardBoard />
    </BoardProvider>
  );
}
