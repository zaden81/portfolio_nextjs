"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  // Minimum 3s timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Page load detection
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

  // Trigger fade-out when both conditions are met
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
      <Image
        src="/icon.png"
        alt="Loading"
        width={80}
        height={80}
        priority
        className="animate-[spin_1.5s_linear_infinite]"
      />
    </div>
  );
}
