import { cn } from "@/lib/utils";

interface StatusAlertProps {
  variant: "success" | "error";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: "bg-green-900/40 border-green-700 text-green-300",
  error: "bg-red-900/40 border-red-700 text-red-300",
};

export default function StatusAlert({
  variant,
  children,
  className,
}: StatusAlertProps) {
  return (
    <div
      className={cn(
        "mb-4 border px-4 py-3 rounded-lg text-sm",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
