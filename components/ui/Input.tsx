import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full bg-bg-tertiary border border-border text-text-primary placeholder-text-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all",
        className
      )}
      {...props}
    />
  );
}
