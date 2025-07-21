"use client";
import { useEffect, useRef } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { computeBoardLayout } from "@lib/boardLayout";
import { CARD_DRAG_THRESHOLD, TABBAR_HEIGHT, TABBAR_GAP } from "../../constants";
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

  const safeCards = Array.isArray(cards) ? cards : []

  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(containerRef)
  const prevBoardId = useRef<string>()
  const lastLayout = useRef<string>("[]")

  useEffect(() => {
    useTabStore.persist
      .rehydrate()
      .then(() =>
        apiFetch("/api/dashboard/layout")
          .then(jsonOrNull)
          .then((d) => {
            if (d && typeof d === "object") {
              const all = Object.values(d).flat() as Tab[]
              setTabs(all)
            }
          })
          .catch(() => {})
      )
      .catch(() => {})
  }, [setTabs])

  useEffect(() => {
    if (!boardId) return
    const currentBoardId = boardId
    const controller = new AbortController()
    apiFetch("/api/dashboard/layout", { signal: controller.signal })
      .then(jsonOrNull)
      .then((d) => {
        if (currentBoardId !== boardId) return
        if (d && typeof d === "object") {
          const tabs = (d[currentBoardId] as Tab[]) ?? []
          setTabs(prev => {
            const others = prev.filter(t => t.boardId !== currentBoardId)
            return [...others, ...tabs]
          })
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [boardId, setTabs])

  useEffect(() => {
    if (!boardId && boards.length > 0) setActive(boards[0].id)
  }, [boardId, boards, setActive])

  useEffect(() => {
    if (!boardId) return
    const boardTabs = safeCards.filter(t => t.boardId === boardId)
    const serialized = JSON.stringify(boardTabs)
    const changedBoard = prevBoardId.current !== boardId
    prevBoardId.current = boardId

    if (changedBoard && boardTabs.length === 0) {
      lastLayout.current = serialized
      return
    }
    if (!changedBoard && lastLayout.current === serialized) return
    lastLayout.current = serialized
    apiFetch("/api/dashboard/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [boardId]: boardTabs }),
    }).catch(() => {})
  }, [boardId, safeCards])

  const current = safeCards.filter((t) => t.boardId === boardId)

  const cols = width < 640 ? 1 : width < 1024 ? 2 : 3
  // Altura fija para todas las tarjetas
  const rowHeight = 200


  const layout: Layout[] = computeBoardLayout(current)

  const { onLayoutChange, moveItem, dropItem } = useCardLayout(
    boardId,
    safeCards,
    setTabs,
  );

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 min-h-screen pb-10 border-t border-[var(--dashboard-border)] ${collapsed ? 'pt-0' : 'pt-2'}`}
      style={{ marginTop: `calc(${TABBAR_HEIGHT} + ${TABBAR_GAP})` }}
    >
      <GridLayout
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        width={width || 800}
        margin={[10,10]}
        isBounded
        preventCollision={false}
        useCSSTransforms
        {...({ dragStartThreshold: CARD_DRAG_THRESHOLD } as any)}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        draggableCancel=".no-drag"
        compactType="vertical"
      >
        {current.map(tab => (
          <div key={tab.id} className="h-full">
            <DraggableCard
              tab={tab}
              grid
              onMove={(dir) => moveItem(tab.id, dir)}
              onDrop={() => dropItem(tab.id)}
            />
          </div>
        ))}
      </GridLayout>
      <AddCardButton />
    </div>
  );
}
