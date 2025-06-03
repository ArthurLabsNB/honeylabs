"use client";

interface MiroBoardProps {
  boardId: string;
}

export default function MiroBoard({ boardId }: MiroBoardProps) {
  const url = `https://miro.com/app/live-embed/${boardId}/`;
  return (
    <iframe
      src={url}
      className="w-full h-[600px] rounded-lg border"
      allowFullScreen
      data-oid="miro-iframe"
    />
  );
}
