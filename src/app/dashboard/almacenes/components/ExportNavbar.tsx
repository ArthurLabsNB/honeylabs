"use client";
import { FileText, FileSpreadsheet, Image as ImageIcon, FileCode, FileDown, File } from "lucide-react";

interface Props {
  onExport: (format: string) => void;
}

const options = [
  { format: "pdf", label: "PDF", icon: FileText },
  { format: "excel", label: "Excel", icon: FileSpreadsheet },
  { format: "imagen", label: "Imagen", icon: ImageIcon },
  { format: "xml", label: "XML", icon: FileCode },
  { format: "csv", label: "CSV", icon: FileText },
  { format: "html", label: "HTML", icon: File },
  { format: "markdown", label: "Markdown", icon: FileDown },
];

export default function ExportNavbar({ onExport }: Props) {
  return (
    <nav className="flex gap-2 pb-2 border-b border-white/10">
      {options.map(({ format, label, icon: Icon }) => (
        <button
          key={format}
          onClick={() => onExport(format)}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-white/10"
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </nav>
  );
}
