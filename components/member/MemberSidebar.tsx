"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CircleDollarSign,
  FileText,
  Gift,
  Headphones,
  LayoutDashboard,
  LogOut,
  Network,
  Settings,
  UserRound,
} from "lucide-react";

type Props = {
  isSigningOut: boolean;
  onSignOut: () => void;
};

const items = [
  ["My Profile", UserRound, null],
  ["My Referrals", Network, null],
  ["Payments", CircleDollarSign, null],
  ["Balloting", Gift, null],
  ["Documents", FileText, null],
  ["Notifications", Bell, null],
  ["Technical Support", Headphones, "/member/support"],
  ["Settings", Settings, null],
] as const;

export default function MemberSidebar({
  isSigningOut,
  onSignOut,
}: Props) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950 p-6 lg:flex lg:flex-col">
      <Link href="/" className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0">
          <Image
            src="/ezlife-logo.png"
            alt="EZ Life logo"
            fill
            priority
            sizes="64px"
            className="object-contain"
          />
        </div>

        <div>
          <p className="text-lg font-bold">EZ Life</p>
          <p className="text-xs text-slate-500">Member Portal</p>
        </div>
      </Link>

      <nav className="mt-8 space-y-2">
        <Link
          href="/member/dashboard"
          className="flex items-center gap-3 rounded-2xl bg-indigo-500/15 px-4 py-3 text-sm font-semibold text-indigo-200"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>

        {items.map(([label, Icon, href]) =>
          href ? (
            <Link
              key={label}
              href={href}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{label}</span>
            </Link>
          ) : (
            <button
              key={label}
              type="button"
              disabled
              title="Coming soon"
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-600"
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{label}</span>
              <span className="text-[10px] uppercase">Soon</span>
            </button>
          ),
        )}
      </nav>

      <div className="mt-6 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-60"
        >
          <LogOut className="h-5 w-5" />
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
