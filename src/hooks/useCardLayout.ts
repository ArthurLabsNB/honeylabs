"use client";
import { useCallback, useEffect, useRef } from 'react';
import type { Layout } from 'react-grid-layout';
import { compactLayout } from '@lib/boardLayout';
import type { Tab } from './useTabs';
import { useLiveRegion } from './useLiveRegion';

export function applyLayout(tabs: Tab[], layout: Layout[]) {
  return tabs.map(t => {
    const it = layout.find(l => l.i === t.id);
    return it ? { ...t, x: it.x, y: it.y, w: it.w, h: it.h } : t;
  });
}

export default function useCardLayout(
  boardId: string | undefined,
  tabs: Tab[],
  setTabs: (tabs: Tab[]) => void,
) {
  const key = boardId ? `card-layout-${boardId}` : null;
  const loaded = useRef(false);

  useEffect(() => {
    loaded.current = false;
  }, [boardId]);

  useEffect(() => {
    if (!key) return;
    const boardTabs = tabs.filter(t => t.boardId === boardId);
    if (boardTabs.length === 0) return;
    try {
      if (!loaded.current) {
        loaded.current = true;
        const raw = localStorage.getItem(key);
        if (raw) {
          const data = JSON.parse(raw) as Layout[];
          if (Array.isArray(data)) {
            const compacted = compactLayout(data);
            setTabs(prev => applyLayout(prev, compacted));
            return;
          }
        }
      }

      const layout = boardTabs.map(t => ({
        i: t.id,
        x: t.x ?? 0,
        y: t.y ?? 0,
        w: t.w ?? 1,
        h: t.h ?? 1,
      }));
      localStorage.setItem(key, JSON.stringify(compactLayout(layout)));
    } catch {}
  }, [key, boardId, tabs, setTabs]);

  const save = useCallback(
    (layout: Layout[]) => {
      if (!key) return;
      try {
        localStorage.setItem(key, JSON.stringify(compactLayout(layout)));
      } catch {}
    },
    [key],
  );

  const onLayoutChange = useCallback(
    (layout: Layout[]) => {
      const compacted = compactLayout(layout);
      setTabs(applyLayout(tabs, compacted));
      save(compacted);
    },
    [setTabs, save, tabs],
  );

  const { speak } = useLiveRegion();

  const moveItem = useCallback(
    (id: string, dir: 'left' | 'right' | 'up' | 'down') => {
      setTabs(prev => prev.map(t => {
        if (t.id !== id) return t;
        let x = t.x ?? 0;
        let y = t.y ?? 0;
        switch (dir) {
          case 'left':
            x = Math.max(0, x - 1);
            break;
          case 'right':
            x = Math.min(1, x + 1);
            break;
          case 'up':
            y = Math.max(0, y - 1);
            break;
          case 'down':
            y = Math.max(0, y + 1);
            break;
        }
        return { ...t, x, y };
      }));
    },
    [setTabs],
  );

  const dropItem = useCallback(
    (id: string) => {
      const layout = tabs.map(t => ({
        i: t.id,
        x: t.x ?? 0,
        y: t.y ?? 0,
        w: t.w ?? 1,
        h: t.h ?? 1,
      }));
      save(layout);
      speak('Tarjeta movida');
    },
    [tabs, save, speak],
  );

  return { onLayoutChange, moveItem, dropItem };
}
