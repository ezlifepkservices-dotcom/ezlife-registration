"use client";

import Link from "next/link";
import {
  Bell,
  CircleDollarSign,
  Gift,
  Home,
  LifeBuoy,
  LogOut,
  ShoppingBag,
  UserRound,
} from "lucide-react";

type Props = {
  firstName: string;
  isSigningOut: boolean;
  onSignOut: () => void;
};

const bottomItems = [
  ["Home", "/member/dashboard", Home],
  ["Purchase", "/member/purchases", ShoppingBag],
  ["Payment", "/member/payments", CircleDollarSign],
  ["Balloting", "/member/balloting", Gift],
  ["Support", "/member/support", LifeBuoy],
] as const;

export default function MemberHeader({
  firstName,
  isSigningOut,
  onSignOut,
}: Props) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8 lg:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300 lg:text-sm lg:normal-case lg:tracking-normal lg:text-slate-500">
              Member Dashboard
            </p>
            <h1 className="truncate text-lg font-black text-white sm:text-xl">
              Welcome back, {firstName}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled
              title="Notifications coming soon"
              className="relative flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-500 sm:h-11 sm:w-11 sm:rounded-2xl"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 sm:h-11 sm:w-11 sm:rounded-2xl">
              <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <button
              type="button"
              onClick={onSignOut}
              disabled={isSigningOut}
              aria-label="Sign out"
              className="hidden h-11 items-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm font-semibold text-rose-200 sm:flex lg:hidden"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#08101F]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {bottomItems.map(([label, href, Icon]) => (
            <Link
              key={label}
              href={href}
              className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-slate-400 transition active:bg-white/5 active:text-violet-300"
            >
              <Icon className="h-5 w-5" />
              <span className="w-full truncate text-center">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
