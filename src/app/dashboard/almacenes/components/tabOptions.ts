import type { TabType } from "@/hooks/useTabs";

export const tabOptions: Array<{ type: TabType; label: string }> = [
  { type: "materiales", label: "Materiales" },
  { type: "unidades", label: "Unidades" },
  { type: "auditorias", label: "Auditorías" },
];
