"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

const variantStyles = {
  primary:
    "bg-accent hover:bg-accent-hover text-white disabled:opacity-60",
  outline:
    "border border-border text-text-secondary hover:text-text-primary hover:border-border-hover",
  ghost: "text-text-secondary hover:text-text-primary",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  rounded = true,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={cn(
        "font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        variantStyles[variant],
        sizeStyles[size],
        rounded && "rounded-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
