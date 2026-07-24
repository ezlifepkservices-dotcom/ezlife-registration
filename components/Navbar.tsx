"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Home", "/"],
  ["About", "/#about"],
  ["Why EZ Life", "/#why-ez-life"],
  ["Services", "/#services"],
  ["How It Works", "/#how-it-works"],
  ["Referral", "/#referral"],
  ["Balloting", "/#balloting"],
  ["Partnership", "/#partnership"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#08101F]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0">
            <Image
              src="/ezlife-logo.png"
              alt="EZ Life logo"
              fill
              priority
              sizes="56px"
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-xl font-black text-white">EZ Life</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-violet-300">
              Empowering Possibilities
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/5"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
          >
            Join EZ Life
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#08101F] px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-white/15 px-4 py-3 text-center font-bold text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-violet-600 px-4 py-3 text-center font-black text-white"
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
