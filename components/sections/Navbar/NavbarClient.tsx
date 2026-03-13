"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS, LOGO_TEXT, PHONE_NUMBER } from "@/config";
import { PhoneIcon } from "@/components/icons";
import { Container } from "@/components/ui";
import MobileMenu from "./MobileMenu";

export default function NavbarClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? "bg-[#232323]/95 shadow-lg backdrop-blur-sm" : "bg-[#232323]"
      }`}
    >
      <Container className="py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("#home")}
          className="text-white font-bold text-xl tracking-wide hover:text-purple-400 transition-colors"
        >
          {LOGO_TEXT}
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Phone button desktop */}
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="hidden lg:inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <PhoneIcon />
          {PHONE_NUMBER}
        </a>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-white mb-1.5 transition-all" />
          <div className="w-6 h-0.5 bg-white mb-1.5 transition-all" />
          <div className="w-6 h-0.5 bg-white transition-all" />
        </button>
      </Container>

      <MobileMenu
        isOpen={isOpen}
        navLinks={NAV_LINKS}
        phoneNumber={PHONE_NUMBER}
        onNavClick={handleNavClick}
      />
    </nav>
  );
}
