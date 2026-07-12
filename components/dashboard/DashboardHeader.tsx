"use client";

import {
  Bell,
  ChevronDown,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export default function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F172A]/85 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <div className="min-w-0 pl-14 lg:pl-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Member Dashboard
          </p>

          <h1 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
            Welcome back, Muhammad
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="search"
              placeholder="Search dashboard"
              className="h-11 w-56 rounded-xl border border-white/10 bg-white/[0.045] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-white/[0.07] lg:w-72"
            />
          </div>

          <button
            type="button"
            aria-label="Open notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-slate-300 transition hover:border-violet-400/30 hover:bg-white/[0.08] hover:text-white"
          >
            <Bell size={19} />

            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-violet-400 ring-2 ring-[#0F172A]" />
          </button>

          <div className="relative">
            <button
              type="button"
              aria-expanded={isProfileOpen}
              aria-label="Open profile menu"
              onClick={() => setIsProfileOpen((current) => !current)}
              className="flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-2.5 text-white transition hover:border-violet-400/30 hover:bg-white/[0.08] sm:px-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6D3BFF] to-[#172B63]">
                <UserRound size={17} />
              </span>

              <span className="hidden text-left sm:block">
                <span className="block text-xs font-bold">
                  Muhammad Munaf
                </span>

                <span className="block text-[10px] text-slate-500">
                  Active Member
                </span>
              </span>

              <ChevronDown
                size={16}
                className={`hidden text-slate-500 transition-transform sm:block ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#111C35] p-2 shadow-[0_24px_70px_rgba(2,6,23,0.55)]">
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <UserRound size={17} />
                  My Profile
                </a>

                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <Settings size={17} />
                  Account Settings
                </a>

                <div className="my-2 border-t border-white/10" />

                <a
                  href="/login"
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Sign Out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}