"use client";

import Link from "next/link";
import {
  Bell,
  CreditCard,
  FileText,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    label: "Referrals",
    href: "/dashboard/referrals",
    icon: UsersRound,
  },
  {
    label: "Balloting",
    href: "/dashboard/balloting",
    icon: Gift,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
];

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open dashboard menu"
        onClick={() => setIsOpen(true)}
        className="fixed left-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#111C35] text-white shadow-lg lg:hidden"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#08101F] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-base font-black text-white">
              EZ
            </div>

            <div>
              <p className="text-xl font-black text-white">EZ Life</p>

              <p className="text-[9px] uppercase tracking-[0.2em] text-violet-300">
                Member Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={closeSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-white/10 px-5 py-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
              Membership Status
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

              <p className="font-bold text-white">Active Member</p>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Member ID: EZ-000123
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Main Menu
          </p>

          <div className="mt-3 space-y-1.5">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === 0;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-[#6D3BFF] to-[#172B63] text-white shadow-[0_12px_32px_rgba(109,59,255,0.25)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={19} />

                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={19} />

            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}