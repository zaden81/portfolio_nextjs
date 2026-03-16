import { PERSONAL_INFO_ITEMS } from "@/config";
import { Card } from "@/components/ui";

export default function InfoCard() {
  return (
    <Card>
      <div className="bg-accent px-4 py-3 sm:px-6 sm:py-4">
        <h4 className="text-white font-semibold text-lg">Information</h4>
      </div>
      <div className="px-4 py-3 sm:px-6 sm:py-4 space-y-3">
        {PERSONAL_INFO_ITEMS.map((item) => (
          <div key={item.label} className="flex gap-4 text-sm">
            <span className="text-text-muted w-16 sm:w-20 shrink-0">{item.label}</span>
            {item.href ? (
              <a
                href={item.href}
                className="text-text-secondary hover:text-accent-light transition-colors"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-text-secondary">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
