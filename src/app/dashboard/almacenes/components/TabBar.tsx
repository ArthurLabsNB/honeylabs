"use client";
import BoardTab from "./BoardTab";
import { useBoardStore, type Board } from "@/hooks/useBoards";
import AddBoardButton from "./AddBoardButton";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    const oldIndex = boards.findIndex((t) => t.id === active.id);
    const newIndex = boards.findIndex((t) => t.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={boards.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-2 px-2 py-1">
            {boards.map((tab, idx) => (
              <SortableItem key={tab.id} tab={tab} index={idx} />
            ))}
            <AddBoardButton />
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
