import Link from "next/link";
import { motion } from "framer-motion";
import type { NavLink } from "@/types";

interface MobileMenuProps {
  navLinks: NavLink[];
  phoneNumber: string;
  onNavClick: (href: string) => void;
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2 },
  }),
};

export default function MobileMenu({
  navLinks,
  phoneNumber,
  onNavClick,
  isAuthenticated,
  userName,
  onLogout,
}: MobileMenuProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" as const }}
      className="lg:hidden bg-bg-primary border-t border-border overflow-hidden"
    >
      <div className="px-4 py-4">
        {navLinks.map((link, i) =>
          link.href.startsWith("/") ? (
            <motion.div
              key={link.href}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={link.href}
                onClick={() => onNavClick(link.href)}
                className="block w-full text-left text-text-secondary hover:text-text-primary py-2 text-sm"
              >
                {link.label}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={link.href}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <button
                onClick={() => onNavClick(link.href)}
                className="block w-full text-left text-text-secondary hover:text-text-primary py-2 text-sm"
              >
                {link.label}
              </button>
            </motion.div>
          ),
        )}

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
    </motion.div>
  );
}
