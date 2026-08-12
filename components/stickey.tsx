// components/StickySection.tsx
"use client";
import { ReactNode } from "react";

export default function StickySection({
  children,
  zIndex = 10,
}: {
  children: ReactNode;
  zIndex?: number;
}) {
  return (
    <div className="sticky top-0 min-h-screen w-full" style={{ zIndex }}>
      {children}
    </div>
  );
}