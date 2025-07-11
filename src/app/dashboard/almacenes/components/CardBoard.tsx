"use client";
import { useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useTabStore, Tab } from "@/hooks/useTabs";
import { generarUUID } from "@/lib/uuid";
import DraggableCard from "./DraggableCard";
import { useDetalleUI } from "../DetalleUI";

export default function CardBoard() {
  const { tabs, move, add } = useTabStore();
  const { collapsed } = useDetalleUI();

  useEffect(() => {
    if (tabs.length === 0) {
      add({ id: generarUUID(), title: "Nuevo", type: "blank" });
    }
  }, [tabs.length, add]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex((t) => t.id === active.id);
      const newIndex = tabs.findIndex((t) => t.id === over.id);
      if (oldIndex >= 0 && newIndex >= 0) move(oldIndex, newIndex);
    }
  };

  const formTypes = ["form-material", "form-unidad"];
  const left = tabs.filter((t) => formTypes.includes(t.type));
  const right = tabs.filter((t) => !formTypes.includes(t.type));

  return (
    <div className={`flex gap-4 transition-all duration-300 ${collapsed ? 'pt-0' : 'pt-2'}`}>\
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex-1 space-y-2">
          <SortableContext items={left.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {left.map((tab) => (
              <DraggableCard key={tab.id} tab={tab} />
            ))}
          </SortableContext>
        </div>
        <div className="flex-1 space-y-2">
          <SortableContext items={right.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {right.map((tab) => (
              <DraggableCard key={tab.id} tab={tab} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
