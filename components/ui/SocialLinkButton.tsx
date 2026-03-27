"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";

interface SocialLinkButtonProps {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
}

export default function SocialLinkButton({
  href,
  label,
  icon: Icon,
  className,
}: SocialLinkButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-white hover:bg-accent transition-all",
        className
      )}
    >
      <Icon />
    </motion.a>
  );
}
