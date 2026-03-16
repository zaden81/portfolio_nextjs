import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        rounded && "rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
