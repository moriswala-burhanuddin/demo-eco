"use client";

import { useCursorStore, CursorVariant } from "@/store/cursorStore";
import { ReactNode } from "react";

interface CursorTriggerProps {
  children: ReactNode;
  variant: CursorVariant;
  text?: string;
  className?: string;
}

export function CursorTrigger({ children, variant, text, className }: CursorTriggerProps) {
  const { setVariant } = useCursorStore();

  return (
    <div
      className={className}
      onMouseEnter={() => setVariant(variant, text)}
      onMouseLeave={() => setVariant('default')}
    >
      {children}
    </div>
  );
}
