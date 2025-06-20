"use client";

interface MiroBoardProps {
  boardId: string;
}

export default function MiroBoard({ boardId }: MiroBoardProps) {
  const url = `https://miro.com/app/live-embed/${boardId}/`;
  return (
    <iframe
      src={url}
      className="w-full min-h-[60vh] rounded-lg border"
      allowFullScreen
      data-oid="xbd.67x"
    />
  );
}
