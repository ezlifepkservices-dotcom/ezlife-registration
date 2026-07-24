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
    <section id="why-ez-life" className="relative overflow-hidden bg-[#0B1222] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(109,59,255,0.14),transparent_35%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400 sm:text-sm">Why EZ Life</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2.25rem,4.2vw,4.25rem)] font-black leading-[1.05] tracking-[-0.035em] text-white">A clearer and more secure member journey.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">Verification, protected access and visible progress help every member understand and control each important step.</p>

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

        <div className="relative min-h-[300px] overflow-hidden rounded-[1.75rem] border border-white/10 sm:min-h-[400px] lg:min-h-[520px]">
          <Image src="/photo-why.jpg" alt="Why EZ Life" fill sizes="(max-width:1024px) 100vw,650px" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/70 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
