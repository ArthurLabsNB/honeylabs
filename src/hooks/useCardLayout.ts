"use client";
import { useCallback, useEffect } from 'react';
import type { Layout } from 'react-grid-layout';
import type { Tab } from './useTabs';

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

  useEffect(() => {
    if (!key) return;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const data = JSON.parse(raw) as Layout[];
      if (!Array.isArray(data)) return;
      setTabs(prev =>
        prev.map(t => {
          const it = data.find(l => l.i === t.id);
          return it ? { ...t, x: it.x, y: it.y, w: it.w, h: it.h } : t;
        }),
      );
    } catch {}
  }, [key, setTabs]);

  const save = useCallback(
    (layout: Layout[]) => {
      if (!key) return;
      try {
        localStorage.setItem(key, JSON.stringify(layout));
      } catch {}
    },
    [key],
  );

  const onLayoutChange = useCallback(
    (layout: Layout[]) => {
      setTabs(applyLayout(tabs, layout));
      save(layout);
    },
    [setTabs, save, tabs],
  );

  return { onLayoutChange };
}
