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
import { NAVBAR_HEIGHT } from "../../constants";

function DropIndicator() {
  return <div className="w-px bg-blue-500 h-full" />;
}

function SortableItem({ tab, index }: { tab: Board; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <BoardTab tab={tab} index={index} />
    </div>
  );
}

export default function TabBar() {
  const { boards, move } = useBoardStore();
  const { announce } = useAnnouncement();
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
    useSensor(PointerSensor),
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

  return (
    <div
      className="sticky z-20 overflow-x-auto whitespace-nowrap border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]"
      style={{ top: `calc(${NAVBAR_HEIGHT} + 3.5rem)` }}
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
          <div className="flex gap-2 px-2 py-1">
            {boards.map((tab, idx) => (
              <Fragment key={tab.id}>
                {dropIndex === idx && <DropIndicator />}
                <SortableItem tab={tab} index={idx} />
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
