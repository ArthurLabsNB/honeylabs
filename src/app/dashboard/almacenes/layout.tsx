"use client";
import { AlmacenesUIProvider } from "./ui";

export default function AlmacenesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AlmacenesUIProvider>{children}</AlmacenesUIProvider>;
}
