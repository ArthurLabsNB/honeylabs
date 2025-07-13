"use client";
import CardBoard from "../CardBoard";
import { BoardProvider } from "../../board/BoardProvider";

export default function BoardTab() {
  return (
    <BoardProvider>
      <CardBoard />
    </BoardProvider>
  );
}
