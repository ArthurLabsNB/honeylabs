"use client";
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import usePanelSocket from './usePanelSocket';
import type { PanelUpdate } from '@/types/panel';
import type { Layout } from 'react-grid-layout';

export type LayoutItem = Layout & { z?: number; locked?: boolean; owner?: string };

export default function usePanelSync(
  panelId: string | undefined,
  widgets: string[],
  layout: LayoutItem[],
  setWidgets: (w: string[]) => void,
  setLayout: (l: LayoutItem[]) => void,
) {
  const bcRef = useRef<BroadcastChannel | null>(null);
  const clientId = useRef<string>(Math.random().toString(36).slice(2));
  const skip = useRef(false);

  const { sendUpdate } = usePanelSocket(panelId, (data: PanelUpdate) => {
    if (data.client === clientId.current) return;
    skip.current = true;
    setWidgets(data.widgets);
    setLayout(data.layout as LayoutItem[]);
  });

  useEffect(() => {
    if (!panelId) return;
    const bc = new BroadcastChannel(`panel-sync-${panelId}`);
    bcRef.current = bc;
    const handle = (
      e: MessageEvent<{ widgets: string[]; layout: LayoutItem[]; client?: string }>,
    ) => {
      const { widgets: w, layout: l, client } = e.data || {};
      if (client === clientId.current) return;
      if (!Array.isArray(w) || !Array.isArray(l)) return;
      skip.current = true;
      setWidgets(w);
      setLayout(l as LayoutItem[]);
    };
    bc.addEventListener('message', handle);
    bc.postMessage({ client: clientId.current, widgets, layout });
    sendUpdate({ panelId: panelId!, widgets, layout, client: clientId.current });
    return () => {
      bc.removeEventListener('message', handle);
      bc.close();
      bcRef.current = null;
    };
  }, [panelId]);

  const broadcast = useDebouncedCallback(() => {
    if (!panelId) return;
    bcRef.current?.postMessage({ client: clientId.current, widgets, layout });
    sendUpdate({ panelId: panelId!, widgets, layout, client: clientId.current });
  }, 120);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    broadcast();
  }, [widgets, layout, broadcast]);

  return { clientId: clientId.current };
}
