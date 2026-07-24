import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  Headphones,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const benefits = [
  ["Easy Installments", "Package-based payment plans", CalendarCheck2],
  ["Transparent System", "Clear rules and visible progress", BadgeCheck],
  ["Trusted Platform", "Secure member access", ShieldCheck],
  ["Service Packages", "Approved package selection", PackageCheck],
  ["Secure & Reliable", "Protected member information", LockKeyhole],
  ["Member Support", "Ticket-based help and tracking", Headphones],
] as const;

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0F172A] pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(109,59,255,0.22),transparent_38%)]" />

      <div className="relative mx-auto grid min-h-[720px] max-w-[1600px] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative z-10 flex items-center px-5 py-16 sm:px-8 lg:px-14 xl:px-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-200">
              <Sparkles className="h-4 w-4" />
              A smarter path to better living
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl xl:text-7xl">
              Life&apos;s goals become
              <span className="block bg-gradient-to-r from-white via-violet-200 to-[#8C5CFF] bg-clip-text text-transparent">
                easier with EZ Life.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Register your interest, complete verification and explore approved
              packages for Umrah, travel, home appliances and future property
              opportunities.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-7 font-black text-white shadow-lg transition hover:-translate-y-1"
              >
                Become a Member
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore How It Works
              </Link>
            </div>
          </div>
        </div>

        <div
          className="relative min-h-[520px] bg-cover bg-center lg:min-h-[720px]"
          style={{ backgroundImage: "url('/ezlife-hero-premium.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0F172A] to-transparent" />
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-10 max-w-7xl px-5 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-[#111827]/95 p-4 shadow-2xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {benefits.map(([title, description, Icon]) => (
            <article key={title} className="rounded-2xl p-4 transition hover:bg-white/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-black text-white">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
