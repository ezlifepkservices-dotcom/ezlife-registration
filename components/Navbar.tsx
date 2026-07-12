"use client";

import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Why EZ Life", href: "#why-ez-life" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-[#0F172A]/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-lg font-black text-white">
            EZ
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">EZ Life</h2>
            <p className="text-[10px] uppercase tracking-[0.25em] text-violet-200">
              Empowering Possibilities
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Join EZ Life
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="xl:hidden rounded-xl border border-white/10 bg-white/5 p-3 text-white"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0F172A] xl:hidden">
          <div className="flex flex-col px-6 py-5">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="py-3 text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              className="mt-4 rounded-xl border border-white/10 py-3 text-center text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="mt-3 rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] py-3 text-center font-semibold text-white"
            >
              Join EZ Life
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}