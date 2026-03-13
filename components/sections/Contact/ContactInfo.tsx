import { EMAIL, PHONE } from "@/config";
import SocialLinks from "./SocialLinks";

export default function ContactInfo() {
  return (
    <div className="lg:w-1/3 space-y-8">
      <SocialLinks />

      <div>
        <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
          Email
        </h4>
        <a
          href={`mailto:${EMAIL}`}
          className="text-gray-300 hover:text-purple-400 transition-colors"
        >
          {EMAIL}
        </a>
      </div>

      <div>
        <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
          Call
        </h4>
        <a
          href={`tel:${PHONE}`}
          className="text-gray-300 hover:text-purple-400 transition-colors"
        >
          {PHONE}
        </a>
      </div>
    </div>
  );
}
