import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, HeartHandshake, ShieldCheck, Target } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#0B1222] py-14 sm:py-16 lg:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(109,59,255,0.13),transparent_34%)]" />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-8 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400 sm:text-xs">
            About EZ Life
          </p>

          <h2 className="mt-3 max-w-[520px] text-[clamp(2.25rem,3.8vw,3.55rem)] font-black leading-[1.06] tracking-[-0.038em] text-white">
            Building a better future,
            <span className="block text-violet-300">together.</span>
          </h2>

          <p className="mt-4 max-w-[520px] text-sm leading-7 text-slate-400 sm:text-base">
            EZ Life is a member-focused digital platform connecting approved
            members with selected opportunities through registration,
            verification, package selection, payments, referrals and
            transparent progress tracking.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <article className="min-h-[126px] rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <Target className="h-5 w-5 text-violet-300" />
              <h3 className="mt-3 font-black text-white">Our Mission</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                To provide members with a simple, transparent and digitally
                trackable path to selected lifestyle opportunities.
              </p>
            </article>

            <article className="min-h-[126px] rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <Eye className="h-5 w-5 text-violet-300" />
              <h3 className="mt-3 font-black text-white">Our Vision</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                To become a trusted platform where progress, package rules and
                service access remain clear for every member.
              </p>
            </article>

            <article className="min-h-[108px] rounded-2xl border border-white/10 bg-[#111C35]/70 p-4">
              <HeartHandshake className="h-5 w-5 text-violet-300" />
              <h3 className="mt-3 font-black text-white">Member Focused</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                Every important step is designed around a clear member journey.
              </p>
            </article>

            <article className="min-h-[108px] rounded-2xl border border-white/10 bg-[#111C35]/70 p-4">
              <ShieldCheck className="h-5 w-5 text-violet-300" />
              <h3 className="mt-3 font-black text-white">
                Secure & Transparent
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                Verification, package rules and account progress remain
                protected.
              </p>
            </article>
          </div>

          <Link
            href="/register"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-black text-white transition hover:-translate-y-1"
          >
            Start Your Journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative min-h-[320px] w-full overflow-hidden rounded-[1.6rem] border border-white/10 sm:min-h-[390px] lg:min-h-[455px]">
          <Image
            src="/photo-about-final.jpg"
            alt="Family outside a modern home"
            fill
            sizes="(max-width: 1024px) 100vw, 610px"
            className="scale-[1.08] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/55 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
