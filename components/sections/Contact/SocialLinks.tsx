import { SOCIAL_LINKS } from "@/data";
import { SocialLinkButton } from "@/components/ui";

export default function SocialLinks() {
  return (
    <div>
      <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">
        Stay connected
      </h4>
      <div className="flex gap-3">
        {SOCIAL_LINKS.map((s) => (
          <SocialLinkButton
            key={s.label}
            href={s.href}
            label={s.label}
            icon={s.icon}
          />
        ))}
      </div>
    </div>
  );
}
