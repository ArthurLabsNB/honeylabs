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
import DraggableCard from "./DraggableCard";
import AddTabButton from "./AddTabButton";
import { useDetalleUI } from "../DetalleUI";
import { useDroppable } from "@dnd-kit/core";

function Column({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`flex-1 space-y-2 ${isOver ? 'bg-white/5' : ''}`}>{children}</div>
  );
}

export default function CardBoard() {
  const { tabs: cards, move, update, setTabs } = useTabStore();
  const { collapsed } = useDetalleUI();

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
    apiFetch("/api/dashboard/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabs: cards }),
    }).catch(() => {});
  }, [cards]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (!over) return;
    const oldIndex = cards.findIndex((t) => t.id === active.id);
    if (oldIndex < 0) return;
    let newIndex = cards.findIndex((t) => t.id === over.id);
    let overSide: "left" | "right";
    if (over.id === "left" || over.id === "right") {
      overSide = over.id;
      const leftCount = cards.filter((t) => (t.side ?? "left") === "left").length;
      newIndex = overSide === "left" ? leftCount : cards.length;
    } else {
      overSide = cards[newIndex]?.side ?? "left";
    }
    move(oldIndex, newIndex);
    if ((cards[oldIndex].side ?? "left") !== overSide) {
      update(active.id, { side: overSide });
    }
  };

  const left = cards.filter((t) => (t.side ?? "left") === "left");
  const right = cards.filter((t) => (t.side ?? "left") === "right");

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
      <AddTabButton />
    </div>
  );
}
