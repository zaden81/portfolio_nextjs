import { EMAIL, PHONE } from "@/config";
import SocialLinks from "./SocialLinks";

export default function ContactInfo() {
  return (
    <div className="lg:w-1/3 space-y-8">
      <SocialLinks />

      <div>
        <h4 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">
          Email
        </h4>
        <a
          href={`mailto:${EMAIL}`}
          className="text-text-secondary hover:text-accent-light transition-colors"
        >
          {EMAIL}
        </a>
      </div>

      <div>
        <h4 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">
          Call
        </h4>
        <a
          href={`tel:${PHONE}`}
          className="text-text-secondary hover:text-accent-light transition-colors"
        >
          {PHONE}
        </a>
      </div>
    </div>
  );
}
