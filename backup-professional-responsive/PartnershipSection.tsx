import Image from "next/image";
import { Building2, Handshake, ShieldCheck, TrendingUp } from "lucide-react";

const items = [
  ["Collaboration", "Connect for future service opportunities.", Handshake],
  ["Structured Review", "Partnerships follow an approval process.", Building2],
  ["Professional Standards", "Quality and member trust stay central.", ShieldCheck],
  ["Shared Growth", "Create long-term member value together.", TrendingUp],
] as const;

export default function PartnershipSection() {
  return (
    <section id="partnership" className="relative overflow-hidden bg-[#0B1222] py-20 sm:py-24">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">Partnership</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">Build meaningful opportunities together.</h2>
          <p className="mt-5 max-w-xl leading-8 text-slate-400">EZ Life welcomes future collaboration with service providers and partners who value quality and transparency.</p>
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
          <Image src="/visual-partnership.png" alt="Partnership" fill sizes="(max-width:1024px) 100vw,650px" className="object-contain drop-shadow-[0_30px_80px_rgba(109,59,255,0.25)]" />
        </div>
      </div>
    </section>
  );
}
