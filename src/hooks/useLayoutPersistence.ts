"use client";
import { useCallback, useEffect } from 'react';
import type { Layout } from 'react-grid-layout';

export type LayoutItem = Layout & { z?: number; locked?: boolean; owner?: string };

export default function useLayoutPersistence(
  panelId: string | undefined,
  widgets: string[],
  layout: LayoutItem[],
  setWidgets: (w: string[]) => void,
  setLayout: (l: LayoutItem[]) => void,
) {
  const key = panelId ? `panel-layout-${panelId}` : null;

  const save = useCallback(() => {
    if (!key) return;
    const data = { widgets, layout, ts: Date.now() };
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  }, [key, widgets, layout]);

  const load = useCallback(() => {
    if (!key) return;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const data = JSON.parse(raw) as { widgets: unknown; layout: unknown };
      if (Array.isArray(data.widgets) && Array.isArray(data.layout)) {
        setWidgets(data.widgets as string[]);
        setLayout(data.layout as LayoutItem[]);
      }
    } catch {}
  }, [key, setWidgets, setLayout]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    save();
  }, [save]);

  return { save, load };
}
