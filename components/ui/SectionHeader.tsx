import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  className?: string;
}

export default function SectionHeader({
  imageSrc,
  imageAlt,
  title,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4 mb-8 sm:mb-10 lg:mb-12", className)}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={56}
        height={56}
        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover"
      />
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold">{title}</h2>
    </div>
  );
}
