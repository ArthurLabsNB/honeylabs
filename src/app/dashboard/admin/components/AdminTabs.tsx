"use client";
import { useState } from "react";

interface Panel {
  key: string;
  label: string;
  content: React.ReactNode;
}

export default function AdminTabs({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(panels[0]?.key);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {panels.map((p) => (
          <button
            key={p.key}
            onClick={() => setActive(p.key)}
            className={`px-3 py-1 rounded-md text-sm ${
              active === p.key ? "bg-amber-500" : "bg-white/10"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {panels.map((p) =>
        p.key === active ? (
          <div key={p.key}>{p.content}</div>
        ) : null
      )}
    </div>
  );
}
