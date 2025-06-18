"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import PromptModal from "@/components/PromptModal";

interface PromptState {
  message: string;
  initial: string;
  resolve: (v: string | null) => void;
}

const PromptContext = createContext<(message: string, initial?: string) => Promise<string | null>>(
  async () => null,
);

export function PromptProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PromptState | null>(null);

  const prompt = (message: string, initial = "") =>
    new Promise<string | null>((resolve) => setState({ message, initial, resolve }));

  const close = (value: string | null) => {
    state?.resolve(value);
    setState(null);
  };

  return (
    <PromptContext.Provider value={prompt}>
      {children}
      {state && (
        <PromptModal
          message={state.message}
          initial={state.initial}
          onSubmit={(v) => close(v)}
          onCancel={() => close(null)}
        />
      )}
    </PromptContext.Provider>
  );
}

export function usePrompt() {
  return useContext(PromptContext);
}
