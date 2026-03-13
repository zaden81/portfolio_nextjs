import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

const variantStyles = {
  primary:
    "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60",
  outline:
    "border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500",
  ghost: "text-gray-300 hover:text-white",
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
