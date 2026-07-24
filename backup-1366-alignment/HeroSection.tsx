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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(109,59,255,0.22),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative mx-auto grid min-h-[710px] max-w-[1500px] items-center gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-200 backdrop-blur">
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

        <div className="relative min-h-[500px] lg:min-h-[620px]">
          <div className="absolute inset-0 overflow-hidden rounded-[2.4rem] border border-white/10">
            <Image
              src="/ezlife-house-background.jpg"
              alt="Modern home representing EZ Life opportunities"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 760px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/75 via-[#0F172A]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F172A]/90 to-transparent" />
          </div>

          <div className="absolute inset-x-[-3%] bottom-[-2%] top-[8%] z-10">
            <Image
              src="/ezlife-services-clean.png"
              alt="Travel, home appliances, motorcycle and electronics"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 760px"
              className="object-contain object-bottom drop-shadow-[0_35px_85px_rgba(2,6,23,0.9)]"
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-5 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-[#111827]/95 p-4 shadow-2xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {benefits.map(([title, description, Icon]) => (
            <article
              key={title}
              className="rounded-2xl p-4 transition hover:bg-white/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-3 text-sm font-black text-white">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
