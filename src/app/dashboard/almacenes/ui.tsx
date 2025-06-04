"use client";
import { createContext, useContext, useState } from "react";

type View = "list" | "grid";
interface AlmacenesUIState {
  view: View;
  setView: (view: View) => void;
}

const AlmacenesUIContext = createContext<AlmacenesUIState>({
  view: "list",
  setView: () => {},
});

export function AlmacenesUIProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("list");
  return (
    <AlmacenesUIContext.Provider value={{ view, setView }}>
      {children}
    </AlmacenesUIContext.Provider>
  );
}

export function useAlmacenesUI() {
  return useContext(AlmacenesUIContext);
}
