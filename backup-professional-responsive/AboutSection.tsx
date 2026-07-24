import Link from "next/link";
import {
  ArrowRight,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Target,
} from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0B1222] py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-16 h-[420px] w-[620px] rounded-[3rem] border border-violet-300/10" />
        <div className="absolute right-16 top-28 h-[330px] w-[470px] rounded-[2.4rem] border border-violet-300/10" />
        <div className="absolute right-28 top-36 h-[240px] w-[320px] rounded-[1.8rem] border border-violet-300/10" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
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

            <Link
              href="/register"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-violet-600 px-6 font-black text-white transition hover:-translate-y-1"
            >
              Start Your Journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-black text-white">Our Mission</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                To provide members with a simple, transparent and digitally
                trackable path to selected lifestyle opportunities.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-black text-white">Our Vision</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                To become a trusted membership platform where progress,
                package rules and service access remain clear for every member.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#111C35]/75 p-6">
              <HeartHandshake className="h-6 w-6 text-violet-300" />
              <h3 className="mt-4 font-black text-white">Member Focused</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Every important step is designed around a clear member journey.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#111C35]/75 p-6">
              <ShieldCheck className="h-6 w-6 text-violet-300" />
              <h3 className="mt-4 font-black text-white">Secure & Transparent</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Verification, package rules and account progress remain protected.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
