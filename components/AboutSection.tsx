import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const values = [
  ["Member Focused", "A clear journey built around member progress.", UsersRound],
  ["Fair Process", "Package rules and eligibility remain visible.", Scale],
  ["Secure & Trusted", "Member information is protected and verified.", ShieldCheck],
  ["Dedicated Support", "Members can raise and track support tickets.", HeartHandshake],
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0B1222] py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(109,59,255,0.18),transparent_40%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
            About EZ Life
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            A structured platform designed to
            <span className="block text-violet-300">serve members better.</span>
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-slate-400">
            EZ Life connects approved members with selected service packages through
            registration, verification, package selection, payment tracking and
            transparent progress monitoring.
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
          {values.map(([title, description, Icon]) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}

          <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 sm:col-span-2">
            <Image
              src="/ezlife-about-premium.jpg"
              alt="EZ Life opportunities"
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/80 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
