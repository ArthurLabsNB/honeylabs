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
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { generarUUID } from "@/lib/uuid";
import DraggableCard from "./DraggableCard";
import { useDetalleUI } from "../DetalleUI";
import { useDroppable } from "@dnd-kit/core";

function Column({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`flex-1 space-y-2 ${isOver ? 'bg-white/5' : ''}`}>{children}</div>
  );
}

export default function CardBoard() {
  const { tabs, move, add, update, setTabs } = useTabStore();
  const { collapsed } = useDetalleUI();

  useEffect(() => {
    if (tabs.length === 0) {
      add({ id: generarUUID(), title: "Nuevo", type: "blank", side: "left" });
    }
  }, [tabs.length, add]);

  useEffect(() => {
    useTabStore.persist.rehydrate();
    apiFetch("/api/dashboard/layout")
      .then(jsonOrNull)
      .then((d) => {
        if (Array.isArray(d?.tabs)) setTabs(d.tabs as Tab[]);
      })
      .catch(() => {});
  }, [setTabs]);

  useEffect(() => {
    apiFetch("/api/dashboard/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabs }),
    }).catch(() => {});
  }, [tabs]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over) return;
    const oldIndex = tabs.findIndex((t) => t.id === active.id);
    if (oldIndex < 0) return;
    let newIndex = tabs.findIndex((t) => t.id === over.id);
    let overSide: "left" | "right";
    if (over.id === "left" || over.id === "right") {
      overSide = over.id;
      const leftCount = tabs.filter((t) => (t.side ?? "left") === "left").length;
      newIndex = overSide === "left" ? leftCount : tabs.length;
    } else {
      overSide = tabs[newIndex]?.side ?? "left";
    }
    move(oldIndex, newIndex);
    if ((tabs[oldIndex].side ?? "left") !== overSide) {
      update(active.id, { side: overSide });
    }
  };

  const left = tabs.filter((t) => (t.side ?? "left") === "left");
  const right = tabs.filter((t) => (t.side ?? "left") === "right");

  return (
    <div className={`flex gap-4 transition-all duration-300 ${collapsed ? 'pt-0' : 'pt-2'}`}>\
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Column id="left">
          <SortableContext items={left.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {left.map((tab) => (
              <DraggableCard key={tab.id} tab={tab} />
            ))}
          </SortableContext>
        </Column>
        <Column id="right">
          <SortableContext items={right.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {right.map((tab) => (
              <DraggableCard key={tab.id} tab={tab} />
            ))}
          </SortableContext>
        </Column>
      </DndContext>
    </div>
  );
}
