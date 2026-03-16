import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn("bg-bg-tertiary rounded-2xl overflow-hidden", className)}>
      {children}
    </div>
  );
}
