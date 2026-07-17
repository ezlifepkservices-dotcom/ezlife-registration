"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

const portalCards = [
  {
    title: "Member Portal",
    description:
      "Access your membership, referrals, payments, balloting, documents and notifications.",
    href: "/member/login",
    buttonText: "Continue as Member",
    icon: UserRound,
    badge: "For Members",
    features: [
      "View membership details",
      "Track referrals and network",
      "Check payments and balloting",
    ],
    gradient: "from-violet-600/20 via-indigo-600/10 to-transparent",
    iconClassName: "bg-violet-500/15 text-violet-300",
    buttonClassName:
      "from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500",
  },
  {
    title: "Admin Portal",
    description:
      "Manage registrations, members, approvals, payments, reports and EZ Life operations.",
    href: "/admin/login",
    buttonText: "Continue as Admin",
    icon: Building2,
    badge: "Authorized Access",
    features: [
      "Approve registrations",
      "Manage members and operations",
      "Access reports and controls",
    ],
    gradient: "from-blue-600/20 via-cyan-600/10 to-transparent",
    iconClassName: "bg-blue-500/15 text-blue-300",
    buttonClassName:
      "from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
  },
];

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F172A] px-5 py-10 text-white sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 hidden h-[430px] w-[430px] rounded-full bg-[#172B63]/60 blur-[140px] sm:block" />
        <div className="absolute -right-40 bottom-0 hidden h-[460px] w-[460px] rounded-full bg-[#6D3BFF]/25 blur-[150px] sm:block" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center">
        <div className="w-full">
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 sm:backdrop-blur-xl"
            >
              <div className="relative h-20 w-20 shrink-0">
                <Image
                  src="/ezlife-logo.png"
                  alt="EZ Life logo"
                  fill
                  priority
                  sizes="80px"
                  className="object-contain"
                />
              </div>

              <div className="text-left">
                <p className="text-2xl font-black text-white">EZ Life</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-violet-300">
                  Empowering Possibilities
                </p>
              </div>
            </Link>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
              <Sparkles size={14} />
              Secure Portal Access
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Choose your login portal
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Select the portal that matches your account. Members and
              administrators use separate secure login areas.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
            {portalCards.map((portal) => {
              const Icon = portal.icon;

              return (
                <article
                  key={portal.title}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_100px_rgba(2,6,23,0.4)] transition duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-8 sm:backdrop-blur-2xl"
                >
                  <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${portal.gradient}`} />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${portal.iconClassName}`}>
                        <Icon size={28} />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
                        {portal.badge}
                      </span>
                    </div>

                    <h2 className="mt-7 text-2xl font-black text-white sm:text-3xl">
                      {portal.title}
                    </h2>

                    <p className="mt-4 min-h-20 leading-7 text-slate-400">
                      {portal.description}
                    </p>

                    <div className="mt-6 space-y-3">
                      {portal.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={portal.href} className={`mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r px-5 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 ${portal.buttonClassName}`}>
                      {portal.buttonText}
                      <ArrowRight size={19} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-400">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-400" />
            <p>
              Member accounts are created after approval. Admin access is
              restricted to authorized EZ Life administrators only.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-semibold text-slate-500 transition hover:text-white">
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
