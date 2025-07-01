"use client";
import { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import type { Layout } from 'react-grid-layout';

export type LayoutItem = Layout & { z?: number; locked?: boolean; owner?: string };
export interface Subboard {
  id: string;
  nombre: string;
  permiso: 'edicion' | 'lectura';
  widgets: string[];
  layout: LayoutItem[];
}

export default function useSubboards(
  panelId: string | undefined,
  widgets: string[],
  layout: LayoutItem[],
  setWidgets: (w: string[]) => void,
  setLayout: (l: LayoutItem[]) => void,
) {
  const [subboards, setSubboards] = useState<Subboard[]>([]);
  const [activeSub, setActiveSub] = useState('');

  const saveCurrentSub = useCallback(() => {
    setSubboards(bs => {
      const updated = bs.map(b => (b.id === activeSub ? { ...b, widgets, layout } : b));
      if (panelId) localStorage.setItem(`panel-subboards-${panelId}`, JSON.stringify(updated));
      return updated;
    });
  }, [activeSub, widgets, layout, panelId]);

  const switchSubboard = useCallback(
    (id: string) => {
      saveCurrentSub();
      const sb = subboards.find(s => s.id === id);
      if (!sb) return;
      setActiveSub(id);
      setWidgets(sb.widgets);
      setLayout(sb.layout);
    },
    [saveCurrentSub, subboards, setWidgets, setLayout],
  );

  const addSubboard = useCallback(
    (nombre: string) => {
      const nuevo = { id: nanoid(), nombre, permiso: 'edicion' as const, widgets: [], layout: [] };
      saveCurrentSub();
      const list = [...subboards, nuevo];
      setSubboards(list);
      setActiveSub(nuevo.id);
      setWidgets([]);
      setLayout([]);
      if (panelId) localStorage.setItem(`panel-subboards-${panelId}`, JSON.stringify(list));
    },
    [panelId, saveCurrentSub, subboards, setWidgets, setLayout],
  );

  useEffect(() => {
    if (!panelId) return;
    let boards: Subboard[] = [];
    try { boards = JSON.parse(localStorage.getItem(`panel-subboards-${panelId}`) || '[]'); } catch {}
    if (boards.length) {
      setSubboards(boards);
      setActiveSub(boards[0].id);
      setWidgets(boards[0].widgets);
      setLayout(boards[0].layout);
    }
  }, [panelId, setWidgets, setLayout]);

  return { subboards, activeSub, addSubboard, switchSubboard, saveCurrentSub, setSubboards, setActiveSub };
}
