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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "w-10 h-10 rounded-full bg-[#2d2d2d] flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all",
        className
      )}
    >
      <Icon />
    </a>
  );
}
