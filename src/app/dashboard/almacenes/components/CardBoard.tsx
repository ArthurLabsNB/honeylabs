"use client";
import { useEffect, useRef } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { useTabStore, Tab } from "@/hooks/useTabs";
import { useBoardStore } from "@/hooks/useBoards";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import DraggableCard from "./DraggableCard";
import AddCardButton from "./AddCardButton";
import { useDetalleUI } from "../DetalleUI";
import useCardLayout from "@/hooks/useCardLayout";
import useElementSize from "@/hooks/useElementSize";

export default function CardBoard() {
  const { tabs: cards, setTabs } = useTabStore();
  const { activeId: boardId, boards, setActive } = useBoardStore();
  const { collapsed } = useDetalleUI();

  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(containerRef)

  useEffect(() => {
    useTabStore.persist
      .rehydrate()
      .then(() =>
        apiFetch("/api/dashboard/layout")
          .then(jsonOrNull)
          .then((d) => {
            if (
              Array.isArray(d?.tabs) && cards.length === 0
            ) {
              setTabs(d.tabs as Tab[])
            }
          })
          .catch(() => {})
      )
      .catch(() => {})
  }, [setTabs])

  useEffect(() => {
    if (!boardId && boards.length > 0) setActive(boards[0].id)
  }, [boardId, boards, setActive])

  useEffect(() => {
    apiFetch("/api/dashboard/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabs: cards }),
    }).catch(() => {});
  }, [cards]);

  const current = cards.filter((t) => t.boardId === boardId);

  const cols = width < 640 ? 1 : 2
  const rowHeight = width < 640 ? 140 : 150


  const layout: Layout[] = (() => {
    let leftY = 0;
    let rightY = 0;
    return current.map(t => {
      const x = typeof t.x === 'number' ? t.x : (t.side === 'right' ? 1 : 0);
      const y = typeof t.y === 'number'
        ? t.y
        : (t.side === 'right' ? rightY++ : leftY++);
      return { i: t.id, x, y, w: t.w ?? 1, h: t.h ?? 1 };
    });
  })();

  const { onLayoutChange } = useCardLayout(boardId, cards, setTabs);

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ${collapsed ? 'pt-0' : 'pt-2'} mt-[calc(var(--tabbar-height)+var(--tabbar-gap))]`}
    >
      <GridLayout
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        width={width || 800}
        onLayoutChange={onLayoutChange}
        draggableHandle=".cursor-move"
        compactType={null}
        preventCollision
      >
        {current.map(tab => (
          <div key={tab.id}>
            <DraggableCard tab={tab} grid />
          </div>
        ))}
      </GridLayout>
      <AddCardButton />
    </div>
  );
}
