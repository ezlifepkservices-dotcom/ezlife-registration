"use client";

import Link from "next/link";
import {
  CircleDollarSign,
  Gift,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  ShoppingBag,
  UserRound,
} from "lucide-react";

type Props = {
  isSigningOut: boolean;
  onSignOut: () => void;
};

const items = [
  ["Purchases", ShoppingBag, "/member/purchases"],
  ["Payments", CircleDollarSign, "/member/payments"],
  ["Balloting", Gift, "/member/balloting"],
  ["Support", LifeBuoy, "/member/support"],
] as const;

export default function MemberSidebar({
  isSigningOut,
  onSignOut,
}: Props) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#08101F] p-6 lg:flex lg:flex-col">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 font-black text-white">
          EZ
        </div>
        <div>
          <p className="font-black text-white">EZ Life</p>
          <p className="text-xs text-slate-500">Member Portal</p>
        </div>
      </Link>

      <nav className="mt-10 space-y-2">
        <Link
          href="/member/dashboard"
          className="flex items-center gap-3 rounded-2xl bg-indigo-500/15 px-4 py-3 text-sm font-semibold text-indigo-200"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>

        {items.map(([label, Icon, href]) => (
          <Link
            key={label}
            href={href}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{label}</span>
          </Link>
        ))}

        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-600"
        >
          <UserRound className="h-5 w-5" />
          <span className="flex-1">Profile</span>
          <span className="text-[10px] uppercase">Soon</span>
        </button>
      </nav>

      <div className="mt-auto border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-60"
        >
          <LogOut className="h-5 w-5" />
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
