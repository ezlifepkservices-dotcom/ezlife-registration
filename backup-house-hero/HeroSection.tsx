import Image from "next/image";
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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(109,59,255,0.22),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:62px_62px]" />
        <div className="absolute right-[8%] top-[16%] h-[370px] w-[540px] rounded-[2.5rem] border border-violet-300/15 opacity-50" />
        <div className="absolute right-[13%] top-[22%] h-[290px] w-[430px] rounded-[2rem] border border-violet-300/10 opacity-40" />
      </div>

      <div className="relative mx-auto grid min-h-[700px] max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="relative z-10">
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

        <div className="relative min-h-[460px] lg:min-h-[600px]">
          <div className="absolute inset-10 rounded-full bg-violet-500/10 blur-3xl" />
          <Image
            src="/ezlife-services-clean.png"
            alt="EZ Life travel, property and lifestyle services"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 650px"
            className="object-contain drop-shadow-[0_35px_80px_rgba(2,6,23,0.85)]"
          />
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-5 pb-10 sm:px-6 lg:px-8">
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
