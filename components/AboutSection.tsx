import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, HeartHandshake, ShieldCheck, Target } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="ez-section relative overflow-hidden bg-[#0B1222]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(109,59,255,0.13),transparent_34%)]" />

      <div className="ez-container ez-grid-2 relative">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400 sm:text-xs">About EZ Life</p>
          <h2 className="ez-heading-lg mt-3 max-w-[520px] font-black text-white">
            Building a better future,
            <span className="block text-violet-300">together.</span>
          </h2>

          <p className="ez-body-lg mt-4 max-w-[520px] text-slate-400">
            EZ Life is a member-focused digital platform connecting approved members
            with selected opportunities through registration, verification, package
            selection, payments, referrals and transparent progress tracking.
          </p>

          <div className="ez-card-grid mt-6">
            <article className="min-h-[126px] rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <Target className="h-5 w-5 text-violet-300" />
              <h3 className="mt-3 font-black text-white">Our Mission</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">To provide members with a simple, transparent and digitally trackable path to selected lifestyle opportunities.</p>
            </article>

            <article className="min-h-[126px] rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <Eye className="h-5 w-5 text-violet-300" />
              <h3 className="mt-3 font-black text-white">Our Vision</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">To become a trusted platform where progress, package rules and service access remain clear for every member.</p>
            </article>

            <article className="min-h-[108px] rounded-2xl border border-white/10 bg-[#111C35]/70 p-4">
              <HeartHandshake className="h-5 w-5 text-violet-300" />
              <h3 className="mt-3 font-black text-white">Member Focused</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">Every important step is designed around a clear member journey.</p>
            </article>

            <article className="min-h-[108px] rounded-2xl border border-white/10 bg-[#111C35]/70 p-4">
              <ShieldCheck className="h-5 w-5 text-violet-300" />
              <h3 className="mt-3 font-black text-white">Secure & Transparent</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">Verification, package rules and account progress remain protected.</p>
            </article>
          </div>

          <Link href="/register" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-black text-white transition hover:-translate-y-1">
            Start Your Journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="ez-media-frame">
          <Image src="/photo-about-final.jpg" alt="Family outside a modern home" fill sizes="(max-width: 1024px) 100vw, 610px" className="scale-[1.08] object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/55 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
