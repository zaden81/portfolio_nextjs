import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn("bg-[#2d2d2d] rounded-2xl overflow-hidden", className)}>
      {children}
    </div>
  );
}
