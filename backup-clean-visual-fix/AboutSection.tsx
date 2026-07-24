import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Target,
} from "lucide-react";

const values = [
  {
    title: "Member Focused",
    description:
      "Every important step is designed around a clear and trackable member journey.",
    icon: HeartHandshake,
  },
  {
    title: "Secure & Transparent",
    description:
      "Verification, package rules and account progress remain visible and protected.",
    icon: ShieldCheck,
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#0B1222] py-20 sm:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(109,59,255,0.18),transparent_42%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
            About EZ Life
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            A digital platform built to make
            <span className="block text-violet-300">
              member opportunities easier to manage.
            </span>
          </h2>

          <p className="mt-5 max-w-xl leading-8 text-slate-400">
            EZ Life connects approved members with selected service packages
            through registration, verification, package selection, payment
            tracking, referrals and transparent progress monitoring.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-black text-white">
                Our Mission
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                To provide members with a simple, transparent and digitally
                trackable path to selected lifestyle opportunities.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-black text-white">
                Our Vision
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                To become a trusted membership platform where progress, package
                rules and service access remain clear for every member.
              </p>
            </article>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-white/10 bg-[#111C35]/70 p-5"
                >
                  <Icon className="h-6 w-6 text-violet-300" />
                  <h3 className="mt-4 font-black text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>

          <Link
            href="/register"
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-violet-600 px-6 font-black text-white transition hover:-translate-y-1"
          >
            Start Your Journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative min-h-[480px]">
          <Image
            src="/visual-about-company.png"
            alt="EZ Life company mission, members and lifestyle platform"
            fill
            sizes="(max-width: 1024px) 100vw, 620px"
            className="object-contain drop-shadow-[0_30px_80px_rgba(109,59,255,0.3)]"
          />
        </div>
      </div>
    </section>
  );
}
