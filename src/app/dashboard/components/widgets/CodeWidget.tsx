"use client";
import { useState } from "react";

export default function CodeWidget() {
  const [code, setCode] = useState("// Escribe codigo JS\nconsole.log('Hola');");
  const [output, setOutput] = useState<string | null>(null);

  const run = () => {
    try {
      const result = eval(code); // simple execution
      setOutput(String(result));
    } catch (err: any) {
      setOutput(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full text-xs">
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        className="w-full flex-1 bg-white/10 p-1 rounded font-mono"
      />
      <button onClick={run} className="mt-1 px-2 py-1 bg-white/10 rounded">Ejecutar</button>
      <pre className="mt-1 flex-1 overflow-auto bg-black/20 p-1 rounded whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  );
}
