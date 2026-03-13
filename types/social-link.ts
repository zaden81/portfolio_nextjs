import type { ComponentType, SVGProps } from "react";

export interface SocialLink {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}
