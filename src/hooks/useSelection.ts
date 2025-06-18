"use client";
import { useState } from "react";

export default function useSelection<T = string>(initial: T[] = []) {
  const [selected, setSelected] = useState<T[]>(initial);

  const toggle = (id: T, multi = false) => {
    setSelected((prev) => {
      if (multi) {
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return [id];
    });
  };

  const clear = () => setSelected([]);

  return { selected, setSelected, toggle, clear };
}
