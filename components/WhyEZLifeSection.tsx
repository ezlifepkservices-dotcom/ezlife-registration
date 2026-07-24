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
    <section id="why-ez-life" className="ez-section relative overflow-hidden bg-[#0B1222]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(109,59,255,0.13),transparent_34%)]" />

      <div className="ez-container ez-grid-2 relative">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400 sm:text-xs">Why EZ Life</p>
          <h2 className="ez-heading-lg mt-3 max-w-[520px] font-black text-white">A secure and trusted platform for your goals.</h2>
          <p className="ez-body-lg mt-4 max-w-[520px] text-slate-400">Verification, protected access and visible progress help every member understand and control each important step.</p>

          <div className="ez-card-grid mt-6">
            {items.map(([title, description, Icon]) => (
              <article key={title} className="min-h-[116px] rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <Icon className="h-5 w-5 text-violet-300" />
                <h3 className="mt-3 text-sm font-black text-white sm:text-base">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="ez-media-frame">
          <Image src="/photo-why-final.jpg" alt="Why EZ Life" fill sizes="(max-width: 1024px) 100vw, 610px" className="scale-[1.08] object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/55 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
