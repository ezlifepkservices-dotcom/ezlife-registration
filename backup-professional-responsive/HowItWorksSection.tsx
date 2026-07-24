import Image from "next/image";
import { Activity, BadgeCheck, PackageCheck, UserPlus } from "lucide-react";

const items = [
  ["Register", "Submit details and select an interest area.", UserPlus],
  ["Verify", "Complete account and KYC verification.", BadgeCheck],
  ["Choose Package", "Select an available package.", PackageCheck],
  ["Track Progress", "Follow payment and eligibility status.", Activity],
] as const;

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#0B1222] py-20 sm:py-24">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">How It Works</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">A simple process from registration to eligibility.</h2>
          <p className="mt-5 max-w-xl leading-8 text-slate-400">The member journey moves through registration, verification, package selection, payment and eligibility tracking.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {items.map(([title,description,Icon]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                <Icon className="h-6 w-6 text-violet-300" />
                <h3 className="mt-4 font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="relative min-h-[430px]">
          <Image src="/visual-how.png" alt="How It Works" fill sizes="(max-width:1024px) 100vw,650px" className="object-contain drop-shadow-[0_30px_80px_rgba(109,59,255,0.25)]" />
        </div>
      </div>
    </section>
  );
}
