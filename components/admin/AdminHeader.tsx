"use client";

import {
  Bell,
  ChevronDown,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F172A]/85 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <div className="min-w-0 pl-14 lg:pl-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Administration Panel
          </p>

          <h1 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
            Welcome, Administrator
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search members..."
              className="h-11 w-72 rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]">
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white transition hover:bg-white/[0.08]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63]">
                <ShieldCheck size={18} />
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-bold">
                  Super Admin
                </p>

                <p className="text-xs text-slate-500">
                  Full Access
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`transition ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-white/10 bg-[#111C35] p-2 shadow-2xl">
                <a
                  href="/admin/profile"
                  className="block rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  My Profile
                </a>

                <a
                  href="/admin/settings"
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <Settings size={16} />
                  Settings
                </a>

                <div className="my-2 border-t border-white/10"></div>

                <a
                  href="/login"
                  className="block rounded-xl px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}