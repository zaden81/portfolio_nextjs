import { PERSONAL_INFO_ITEMS } from "@/config";
import { Card } from "@/components/ui";

export default function InfoCard() {
  return (
    <Card>
      <div className="bg-purple-600 px-6 py-4">
        <h4 className="text-white font-semibold text-lg">Information</h4>
      </div>
      <div className="px-6 py-4 space-y-3">
        {PERSONAL_INFO_ITEMS.map((item) => (
          <div key={item.label} className="flex gap-4 text-sm">
            <span className="text-gray-500 w-20 shrink-0">{item.label}</span>
            {item.href ? (
              <a
                href={item.href}
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-gray-300">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
