import Link from "next/link";
import type { NavLink } from "@/types";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  phoneNumber: string;
  onNavClick: (href: string) => void;
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export default function MobileMenu({
  isOpen,
  navLinks,
  phoneNumber,
  onNavClick,
  isAuthenticated,
  userName,
  onLogout,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-bg-primary border-t border-border px-4 py-4">
      {navLinks.map((link) => (
        <button
          key={link.href}
          onClick={() => onNavClick(link.href)}
          className="block w-full text-left text-text-secondary hover:text-text-primary py-2 text-sm"
        >
          {link.label}
        </button>
      ))}

      {isAuthenticated ? (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-text-secondary text-sm">{userName}</span>
          <button
            onClick={onLogout}
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="mt-3 inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-full text-sm"
        >
          Login
        </Link>
      )}

      <a
        href={`tel:${phoneNumber}`}
        className="mt-2 inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-full text-sm"
      >
        {phoneNumber}
      </a>
    </div>
  );
}
