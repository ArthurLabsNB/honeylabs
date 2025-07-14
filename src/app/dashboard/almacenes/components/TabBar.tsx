"use client";
import BoardTab from "./BoardTab";
import { useBoardStore, type Board } from "@/hooks/useBoards";
import { useEffect, useState, Fragment } from "react";
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
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis, snapCenterToCursor } from "@dnd-kit/modifiers";

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
  useEffect(() => {
    useBoardStore.persist.rehydrate();
  }, []);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDragOver = (ev: DragOverEvent) => {
    const { active, over } = ev;
    if (!over) return;
    const oldIndex = boards.findIndex((t) => t.id === active.id);
    const overIndex = boards.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || overIndex === -1) return;
    const arr = arrayMove(boards, oldIndex, overIndex);
    const newIndex = arr.findIndex((t) => t.id === active.id);
    setDropIndex(newIndex);
  };

  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    const oldIndex = boards.findIndex((t) => t.id === active.id);
    const newIndex = boards.findIndex((t) => t.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
    setDropIndex(null);
  };

  return (
    <div
      className="sticky z-20 overflow-x-auto whitespace-nowrap border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]"
      style={{ top: `calc(var(--navbar-height) + 3.5rem)` }}
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
