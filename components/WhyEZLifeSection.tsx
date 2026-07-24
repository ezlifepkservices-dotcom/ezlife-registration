import Image from "next/image";
import { BadgeCheck, Eye, Headphones, ShieldCheck } from "lucide-react";

const items = [
  ["Verified Accounts", "KYC supports a safer member ecosystem.", BadgeCheck],
  ["Secure Access", "Member and admin portals use protected access.", ShieldCheck],
  ["Visible Progress", "Members can monitor their current journey.", Eye],
  ["Member Support", "Support tickets remain trackable.", Headphones],
] as const;

export default function WhyEZLifeSection() {
  return (
    <section id="why-ez-life" className="relative overflow-hidden bg-[#0B1222] py-20 sm:py-24">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">Why EZ Life</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">A clearer and more secure member journey.</h2>
          <p className="mt-5 max-w-xl leading-8 text-slate-400">Verification, package-based rules and visible progress help members understand every important step.</p>
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
          <Image src="/visual-why.png" alt="Why EZ Life" fill sizes="(max-width:1024px) 100vw,650px" className="object-contain drop-shadow-[0_30px_80px_rgba(109,59,255,0.25)]" />
        </div>
      </div>
    </section>
  );
}
