"use client";
import { useEffect, useState } from "react";
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';

let cachedMarked: any;

async function loadMarked() {
  if (!cachedMarked) {
    const mod = await import('marked');
    mod.marked.use(markedKatex());
    cachedMarked = mod.marked;
  }
  return cachedMarked;
}

export default function MarkdownWidget() {
  const [text, setText] = useState("# Titulo\nEscribe **markdown** aquí...");
  const [parser, setParser] = useState<any>(null);

  useEffect(() => {
    loadMarked().then(setParser);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full flex-1 bg-white/10 p-2 rounded mb-2 text-sm"
      />
      <div
        className="prose prose-sm overflow-auto flex-1"
        dangerouslySetInnerHTML={{ __html: parser ? parser.parse(text) : "" }}
      />
    </div>
  );
}
