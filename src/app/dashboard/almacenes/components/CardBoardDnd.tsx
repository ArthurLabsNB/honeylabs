"use client";
import { useEffect, useRef, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { computeBoardLayout } from "@lib/boardLayout";
import { TABBAR_HEIGHT, TABBAR_GAP, POINTER_ACTIVATION_DISTANCE } from "../../constants";
import { useTabStore, type Tab } from "@/hooks/useTabs";
import { useBoardStore } from "@/hooks/useBoards";
import { useDetalleUI } from "../DetalleUI";
import useCardLayout from "@/hooks/useCardLayout";
import useElementSize from "@/hooks/useElementSize";
import AddCardButton from "./AddCardButton";
import DraggableCard from "./DraggableCard";

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

interface SortableCardProps {
  tab: Tab;
  layout: { x: number; y: number; w: number; h: number };
  colWidth: number;
  rowHeight: number;
  marginX: number;
  marginY: number;
}

function SortableCard({ tab, layout, colWidth, rowHeight, marginX, marginY }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id });
  const x = marginX + layout.x * (colWidth + marginX);
  const y = marginY + layout.y * (rowHeight + marginY);
  const width = layout.w * colWidth + (layout.w - 1) * marginX;
  const height = layout.h * rowHeight + (layout.h - 1) * marginY;
  const style: React.CSSProperties = {
    width,
    height,
    transform: `translate3d(${x}px, ${y}px, 0) ${CSS.Transform.toString(transform)}`,
    transition,
    position: "absolute",
    zIndex: isDragging ? 50 : undefined,
    boxShadow: isDragging ? "0 10px 15px rgba(0,0,0,0.3)" : undefined,
  };
  return (
    <motion.div ref={setNodeRef} style={style} whileDrag={{ scale: 1.05 }} {...attributes} {...listeners}>
      <DraggableCard tab={tab} grid />
    </motion.div>
  );
}

export default function CardBoardDnd() {
  const { tabs: cards, setTabs } = useTabStore();
  const { activeId: boardId, boards, setActive } = useBoardStore();
  const { collapsed } = useDetalleUI();

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useElementSize(containerRef);
  const cols = width < 640 ? 1 : 2;
  const rowHeight = width < 640 ? 140 : 150;
  const marginX = 10;
  const marginY = 10;
  const colWidth = cols > 0 ? (width - marginX * (cols + 1)) / cols : 0;

  const safeCards = Array.isArray(cards) ? cards : [];
  const current = safeCards.filter((t) => t.boardId === boardId);

  const baseLayout = computeBoardLayout(current);
  const [layout, setLayout] = useState(baseLayout);
  useEffect(() => setLayout(baseLayout), [baseLayout]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE } }));

  const { onLayoutChange } = useCardLayout(boardId, safeCards, setTabs);

  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    const oldIndex = current.findIndex((t) => t.id === active.id);
    const overIndex = current.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || overIndex === -1) return;
    const reordered = arrayMove(current, oldIndex, overIndex);
    const newLayout = computeBoardLayout(reordered);
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const height = layout.reduce((acc, it) => Math.max(acc, it.y + it.h), 0);

  useEffect(() => {
    if (!boardId && boards.length > 0) setActive(boards[0].id);
  }, [boardId, boards, setActive]);

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 pb-10 border-t border-[var(--dashboard-border)] ${collapsed ? 'pt-0' : 'pt-2'}`}
      style={{ marginTop: `calc(${TABBAR_HEIGHT} + ${TABBAR_GAP})`, height: height * (rowHeight + marginY) + marginY }}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={current.map((t) => t.id)} strategy={rectSortingStrategy}>
          {current.map((tab) => {
            const it = layout.find((l) => l.i === tab.id);
            if (!it) return null;
            return (
              <SortableCard key={tab.id} tab={tab} layout={it} colWidth={colWidth} rowHeight={rowHeight} marginX={marginX} marginY={marginY} />
            );
          })}
        </SortableContext>
      </DndContext>
      <AddCardButton />
    </div>
  );
}
