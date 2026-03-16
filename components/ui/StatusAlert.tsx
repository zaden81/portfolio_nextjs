import { cn } from "@/lib/utils";

interface StatusAlertProps {
  variant: "success" | "error";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: "bg-status-success-bg border-status-success-border text-status-success-text",
  error: "bg-status-error-bg border-status-error-border text-status-error-text",
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
