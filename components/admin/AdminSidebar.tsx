"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CreditCard,
  FileCheck2,
  FileText,
  Gift,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  UserCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Registrations", href: "/admin/registrations", icon: FileCheck2 },
  { label: "Members", href: "/admin/members", icon: UsersRound },
  { label: "Approvals", href: "/admin/approvals", icon: UserCheck },
  { label: "Purchases", href: "/admin/purchases", icon: ShoppingBag },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Overdue Members", href: "/admin/overdue", icon: ShieldAlert },
  { label: "KYC", href: "/admin/kyc", icon: ShieldCheck },
  { label: "Balloting", href: "/admin/balloting", icon: Gift },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Documents", href: "/admin/documents", icon: FileText },
  { label: "Technical Support", href: "/admin/support", icon: Headphones },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => setIsOpen(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <button type="button" aria-label="Open admin menu" onClick={() => setIsOpen(true)} className="fixed left-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#111C35] text-white shadow-lg lg:hidden">
        <Menu size={22} />
      </button>

      {isOpen && <button type="button" aria-label="Close admin menu" onClick={closeSidebar} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#08101F] transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-6">
          <Link href="/" onClick={closeSidebar} className="flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0">
              <Image src="/ezlife-logo.png" alt="EZ Life logo" fill priority sizes="64px" className="object-contain" />
            </div>
            <div>
              <p className="text-xl font-black text-white">EZ Life</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-violet-300">Admin Portal</p>
            </div>
          </Link>
          <button type="button" aria-label="Close admin menu" onClick={closeSidebar} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"><X size={20} /></button>
        </div>

        <div className="border-b border-white/10 px-5 py-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">System Status</p>
            <div className="mt-3 flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" /><p className="font-bold text-white">Operational</p></div>
            <p className="mt-2 text-xs text-slate-500">Supabase connected</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Administration</p>
          <div className="mt-3 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const isOverdue = item.href === "/admin/overdue";
              return (
                <Link key={item.label} href={item.href} onClick={closeSidebar} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-gradient-to-r from-[#6D3BFF] to-[#172B63] text-white shadow-[0_12px_32px_rgba(109,59,255,0.25)]" : isOverdue ? "text-red-300 hover:bg-red-500/10 hover:text-red-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                  <Icon size={19} /><span className="flex-1">{item.label}</span>
                  {isOverdue && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-black text-red-300">12</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link href="/login" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"><LogOut size={19} />Sign Out</Link>
        </div>
      </aside>
    </>
  );
}
