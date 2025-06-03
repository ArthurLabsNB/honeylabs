"use client";
import { useEffect, useState } from "react";
import MiroBoard from "./components/MiroBoard";
import LucidchartEmbed from "./components/LucidchartEmbed";

type Tool = "miro" | "lucidchart";

const miroBoards = [
  { id: "o9J_lAQ-uUI", name: "Board 1" },
  { id: "o9J_lAQ-uUI2", name: "Board 2" },
];

const lucidDocs = [
  { id: "abcd1234", name: "Diagrama 1" },
  { id: "efgh5678", name: "Diagrama 2" },
];

export default function AppCenterPage() {
  const [tool, setTool] = useState<Tool>("miro");
  const [miroBoard, setMiroBoard] = useState(miroBoards[0].id);
  const [lucidDoc, setLucidDoc] = useState(lucidDocs[0].id);

  useEffect(() => {
    const t = localStorage.getItem("appcenter-tool") as Tool | null;
    const mb = localStorage.getItem("appcenter-miro");
    const ld = localStorage.getItem("appcenter-lucid");
    if (t === "miro" || t === "lucidchart") setTool(t);
    if (mb) setMiroBoard(mb);
    if (ld) setLucidDoc(ld);
  }, []);

  useEffect(() => {
    localStorage.setItem("appcenter-tool", tool);
  }, [tool]);
  useEffect(() => {
    localStorage.setItem("appcenter-miro", miroBoard);
  }, [miroBoard]);
  useEffect(() => {
    localStorage.setItem("appcenter-lucid", lucidDoc);
  }, [lucidDoc]);

  return (
    <div className="p-4 space-y-4" data-oid="appcenter-page">
      <h1 className="text-2xl font-bold">App Center</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col">
          Herramienta
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value as Tool)}
            className="mt-1 p-1 border rounded"
          >
            <option value="miro">Miro</option>
            <option value="lucidchart">Lucidchart</option>
          </select>
        </label>
        {tool === "miro" && (
          <label className="flex flex-col">
            Tablero
            <select
              value={miroBoard}
              onChange={(e) => setMiroBoard(e.target.value)}
              className="mt-1 p-1 border rounded"
            >
              {miroBoards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {tool === "lucidchart" && (
          <label className="flex flex-col">
            Diagrama
            <select
              value={lucidDoc}
              onChange={(e) => setLucidDoc(e.target.value)}
              className="mt-1 p-1 border rounded"
            >
              {lucidDocs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="w-full">
        {tool === "miro" ? (
          <MiroBoard boardId={miroBoard} />
        ) : (
          <LucidchartEmbed docId={lucidDoc} />
        )}
      </div>
    </div>
  );
}
