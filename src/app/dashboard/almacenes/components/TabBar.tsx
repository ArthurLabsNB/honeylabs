"use client";
import DraggableTab from "./DraggableTab";
import { useTabStore, type Tab } from "@/hooks/useTabs";
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

function SortableItem({ tab, index }: { tab: Tab; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <DraggableTab tab={tab} index={index} draggable={false} />
    </div>
  );
}

export default function TabBar() {
  const { tabs, move } = useTabStore();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    const oldIndex = tabs.findIndex((t) => t.id === active.id);
    const newIndex = tabs.findIndex((t) => t.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={tabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-2 px-2 py-1">
            {tabs.map((tab, idx) => (
              <SortableItem key={tab.id} tab={tab} index={idx} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
