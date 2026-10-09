"use client";

import { useRef, useState, ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { useCursorStore } from "@/store/cursorStore";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className, strength = 0.2, ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setVariant, setMagnetic } = useCursorStore();

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { width, height, left, top } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    const x = (clientX - centerX) * strength;
    const y = (clientY - centerY) * strength;
    
    setPosition({ x, y });
    
    // Magnetic cursor pulls exactly to the center
    setMagnetic(true, { x: centerX, y: centerY });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setVariant("magnetic");
    if (props.onMouseEnter) props.onMouseEnter(e as any);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setPosition({ x: 0, y: 0 });
    setVariant("default");
    setMagnetic(false);
    if (props.onMouseLeave) props.onMouseLeave(e as any);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn("relative z-10", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
