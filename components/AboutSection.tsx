import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, HeartHandshake, ShieldCheck, Target } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0B1222] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(109,59,255,0.16),transparent_42%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400 sm:text-sm">About EZ Life</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2.25rem,4.5vw,4.5rem)] font-black leading-[1.05] tracking-[-0.035em] text-white">
            Building a better future,
            <span className="block text-violet-300">together.</span>
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            EZ Life is a member-focused digital platform connecting approved members with selected opportunities through registration, verification, package selection, payments, referrals and transparent progress tracking.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
              <Target className="h-6 w-6 text-violet-300" />
              <h3 className="mt-4 text-xl font-black text-white">Our Mission</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                To provide members with a simple, transparent and digitally trackable path to selected lifestyle opportunities.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
              <Eye className="h-6 w-6 text-violet-300" />
              <h3 className="mt-4 text-xl font-black text-white">Our Vision</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                To become a trusted platform where progress, package rules and service access remain clear for every member.
              </p>
            </article>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-[#111C35]/70 p-5">
              <HeartHandshake className="h-6 w-6 text-violet-300" />
              <h3 className="mt-4 font-black text-white">Member Focused</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Every important step is designed around a clear member journey.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#111C35]/70 p-5">
              <ShieldCheck className="h-6 w-6 text-violet-300" />
              <h3 className="mt-4 font-black text-white">Secure & Transparent</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Verification, package rules and account progress remain protected.</p>
            </article>
          </div>

          <Link href="/register" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-violet-600 px-6 font-black text-white transition hover:-translate-y-1">
            Start Your Journey <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-white/10 sm:min-h-[420px] lg:min-h-[560px]">
          <Image src="/photo-about.jpg" alt="Family outside a modern home" fill sizes="(max-width:1024px) 100vw,650px" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/65 via-transparent to-[#0B1222]/10" />
        </div>
      </div>
    </section>
  );
}
