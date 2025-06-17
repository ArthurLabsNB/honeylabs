"use client";
import { useState } from "react";
import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import "katex/dist/katex.min.css";

marked.use(markedKatex());

export default function MarkdownWidget() {
  const [text, setText] = useState("# Titulo\nEscribe **markdown** aquí...");

  return (
    <div className="flex flex-col h-full">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full flex-1 bg-white/10 p-2 rounded mb-2 text-sm"
      />
      <div
        className="prose prose-sm overflow-auto flex-1"
        dangerouslySetInnerHTML={{ __html: marked.parse(text) }}
      />
    </div>
  );
}
