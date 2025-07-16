"use client";
import { announce } from "@react-aria/live-announcer";
import { useCallback } from "react";

export function useLiveRegion() {
  const speak = useCallback((msg: string) => {
    announce(msg, "polite");
  }, []);
  return { speak };
}
