"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, PHONE } from "@/config";
import { PhoneIcon } from "@/components/icons";
import { Container, ThemeToggle } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import MobileMenu from "./MobileMenu";

export default function NavbarClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-bg-primary/95 shadow-lg backdrop-blur-sm" : "bg-bg-primary"
      }`}
    >
      <Container className="py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("#home")}
          className="hover:opacity-80 transition-opacity"
        >
          <Image
            src="/images/logo/logo-text.png"
            alt="Thuong"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6 lg:gap-8 xl:gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="text-text-secondary text-sm">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Login
            </Link>
          )}
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <PhoneIcon />
            {PHONE}
          </a>
        </div>

        {/* Mobile right side */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-text-primary p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-text-primary mb-1.5 transition-all" />
            <div className="w-6 h-0.5 bg-text-primary mb-1.5 transition-all" />
            <div className="w-6 h-0.5 bg-text-primary transition-all" />
          </button>
        </div>
      </Container>

      <MobileMenu
        isOpen={isOpen}
        navLinks={NAV_LINKS}
        phoneNumber={PHONE}
        onNavClick={handleNavClick}
        isAuthenticated={isAuthenticated}
        userName={user?.name}
        onLogout={logout}
      />
    </nav>
  );
}
