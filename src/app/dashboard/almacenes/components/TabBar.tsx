"use client";
import BoardTab from "./BoardTab";
import { useBoardStore, type Board } from "@/hooks/useBoards";
import { useEffect, useState, Fragment, useRef } from "react";
import AddBoardButton from "./AddBoardButton";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis, snapCenterToCursor } from "@dnd-kit/modifiers";
import { useAnnouncement } from "@dnd-kit/accessibility";
import {
  NAVBAR_HEIGHT,
  TABBAR_HEIGHT,
  POINTER_ACTIVATION_DISTANCE,
} from "../../constants";
import { useDashboardUI } from "../../ui";
import { useDetalleUI } from "../DetalleUI";

function DropIndicator() {
  return <div className="w-px bg-blue-500 h-full" />;
}

function SortableItem({ tab, active }: { tab: Board; active: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: tab.id,
    disabled: !active,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(active ? { ...attributes, ...listeners } : {})}
      className="touch-none"
    >
      <BoardTab tab={tab} />
    </div>
  );
}

export default function TabBar() {
  const { boards, move, activeId } = useBoardStore();
  const { announce } = useAnnouncement();
  const { fullscreen } = useDashboardUI();
  const { collapsed } = useDetalleUI();
  const boardsRef = useRef(boards);
  useEffect(() => {
    boardsRef.current = boards;
  }, [boards]);
  const dropIndexRef = useRef<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const updateDropIndex = (idx: number | null) => {
    if (dropIndexRef.current !== idx) {
      dropIndexRef.current = idx;
      setDropIndex(idx);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getIndices = (activeId: string, overId: string) => {
    const oldIndex = boardsRef.current.findIndex((t) => t.id === activeId);
    const overIndex = boardsRef.current.findIndex((t) => t.id === overId);
    return { oldIndex, overIndex };
  };

  const handleDragOver = (ev: DragOverEvent) => {
    const { active, over } = ev;
    if (!over) return;
    const { oldIndex, overIndex } = getIndices(active.id, over.id);
    if (oldIndex === -1 || overIndex === -1) return;
    const newIdx = overIndex + (overIndex < oldIndex ? 0 : 1);
    updateDropIndex(newIdx);
  };

  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    const { oldIndex, overIndex } = getIndices(active.id, over.id);
    if (oldIndex !== -1 && overIndex !== -1) {
      move(oldIndex, overIndex);
      announce("pestaña movida");
    }
    updateDropIndex(null);
  };

  const top = collapsed
    ? fullscreen
      ? '0'
      : NAVBAR_HEIGHT
    : fullscreen
      ? TABBAR_HEIGHT
      : `calc(${NAVBAR_HEIGHT} + ${TABBAR_HEIGHT})`;

  return (
    <div
      className="fixed z-20 w-full overflow-x-auto whitespace-nowrap border-b border-[var(--dashboard-border)] bg-[color:var(--dashboard-card)/0.8] backdrop-blur-sm shadow transition-all"
      style={{ top, height: 'var(--tabbar-height)' } as React.CSSProperties}
      role="tablist"
    >
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis, snapCenterToCursor]}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={boards.map((t) => t.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-1 sm:gap-2 px-2 sm:px-3 py-1">
            {boards.map((tab, idx) => (
              <Fragment key={tab.id}>
                {dropIndex === idx && <DropIndicator />}
                <SortableItem tab={tab} active={tab.id === activeId} />
              </Fragment>
            ))}
            {dropIndex === boards.length && <DropIndicator />}
            <AddBoardButton />
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
