"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      setTimeout(() => {
        setIsPageLoaded(true);
      }, 500);
      return;
    }

    const handleLoad = () => setIsPageLoaded(true);
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (isMinTimeElapsed && isPageLoaded) {
      setTimeout(() => {
        setIsFadingOut(true);
      }, 500);
    }
  }, [isMinTimeElapsed, isPageLoaded]);

  const handleTransitionEnd = useCallback(() => {
    if (isFadingOut) {
      setIsRemoved(true);
    }
  }, [isFadingOut]);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary transition-opacity duration-700 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-24 h-24 rounded-full border-2 border-accent/30 border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" as const }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
        >
          <Image
            src="/icon.png"
            alt="Loading"
            width={64}
            height={64}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
