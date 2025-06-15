"use client";
interface Props {
  rom: string;
}
export default function EmuladorGBA({ rom }: Props) {
  return (
    <iframe
      src={`/emuladores/gbajs/index.html?rom=/roms/${rom}`}
      className="w-full h-96 border"
    />
  );
}
