"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollerProps {
  children: React.ReactNode;
}

export function HorizontalScroller({ children }: HorizontalScrollerProps) {
  return (
    <div className="w-full overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8">
            {children}
        </div>
    </div>
  );
}
