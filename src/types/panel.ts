import type { Layout } from 'react-grid-layout'

export type LayoutItem = Layout & { z?: number; locked?: boolean; owner?: string }

export interface PanelUpdate {
  panelId: string
  widgets: string[]
  layout: LayoutItem[]
  client?: string
}

export interface HistEntry {
  fecha: string
  estado: { widgets: string[]; layout: LayoutItem[] }
}
