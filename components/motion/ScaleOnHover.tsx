"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScaleOnHoverProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  tapScale?: number;
}

export default function ScaleOnHover({
  children,
  className,
  scale = 1.03,
  tapScale = 0.97,
}: ScaleOnHoverProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: tapScale }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
