"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedOverlayProps {
  isVisible: boolean;
  children: React.ReactNode;
  className?: string;
  backdrop?: boolean;
}

export default function AnimatedOverlay({
  isVisible,
  children,
  className,
  backdrop = true,
}: AnimatedOverlayProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    if (!isVisible) return null;
    return (
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center",
          backdrop && "backdrop-blur-sm",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center",
            backdrop && "backdrop-blur-sm",
            className
          )}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
