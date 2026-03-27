import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full bg-bg-tertiary border border-border text-text-primary placeholder-text-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all resize-none",
        className
      )}
      {...props}
    />
  );
}
