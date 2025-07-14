"use client";
import CardBoard from "./CardBoard";
import { BoardProvider } from "../board/BoardProvider";

export default function BoardCard({ board }: { board?: string }) {
  // board prop is reserved for future use (otros tableros)
  return (
    <BoardProvider>
      <CardBoard />
    </BoardProvider>
  );
}
