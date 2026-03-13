import type { NavLink } from "@/types";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  phoneNumber: string;
  onNavClick: (href: string) => void;
}

export default function MobileMenu({
  isOpen,
  navLinks,
  phoneNumber,
  onNavClick,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-[#232323] border-t border-gray-700 px-4 py-4">
      {navLinks.map((link) => (
        <button
          key={link.href}
          onClick={() => onNavClick(link.href)}
          className="block w-full text-left text-gray-300 hover:text-white py-2 text-sm"
        >
          {link.label}
        </button>
      ))}
      <a
        href={`tel:${phoneNumber}`}
        className="mt-3 inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm"
      >
        {phoneNumber}
      </a>
    </div>
  );
}
