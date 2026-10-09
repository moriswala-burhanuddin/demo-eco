"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useCursorStore } from "@/store/cursorStore";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { variant, text, isMagnetic, magneticPosition } = useCursorStore();

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };

  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Set spring values
  useEffect(() => {
    if (isMagnetic) {
      cursorX.set(magneticPosition.x);
      cursorY.set(magneticPosition.y);
    } else {
      cursorX.set(mousePosition.x);
      cursorY.set(mousePosition.y);
    }
  }, [mousePosition, isMagnetic, magneticPosition, cursorX, cursorY]);

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "var(--primary)",
      x: "-50%",
      y: "-50%",
      borderRadius: "50%",
      opacity: 1,
      mixBlendMode: "normal" as any,
    },
    view: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(255, 42, 95, 0.9)", // Electric Cherry with slight opacity
      x: "-50%",
      y: "-50%",
      borderRadius: "50%",
      opacity: 1,
      mixBlendMode: "normal" as any,
    },
    magnetic: {
      width: 12,
      height: 12,
      backgroundColor: "var(--primary)",
      x: "-50%",
      y: "-50%",
      borderRadius: "50%",
      opacity: 0, // Hidden when magnetic because the button itself moves
      mixBlendMode: "normal" as any,
    },
    button: {
      width: 48,
      height: 48,
      backgroundColor: "transparent",
      border: "1px solid var(--primary)",
      x: "-50%",
      y: "-50%",
      borderRadius: "50%",
      opacity: 1,
      mixBlendMode: "normal" as any,
    }
  };

  // Only render on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center text-primary-foreground font-semibold uppercase tracking-widest text-[10px]"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      variants={variants}
      animate={variant}
      transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
    >
      {variant === "view" && text}
    </motion.div>
  );
}
