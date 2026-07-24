import Image from "next/image";
import { Building2, Handshake, ShieldCheck, TrendingUp } from "lucide-react";

const items = [
  ["Trusted Partners", "Work with verified service providers.", Handshake],
  ["Structured Process", "Partnerships follow an approval process.", Building2],
  ["Quality Assurance", "Professional standards remain central.", ShieldCheck],
  ["Long-Term Growth", "Create sustainable member value together.", TrendingUp],
] as const;

export default function PartnershipSection() {
  return (
    <section
      id="partnership"
      className="relative overflow-hidden bg-[#0B1222] py-14 sm:py-16 lg:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(109,59,255,0.13),transparent_34%)]" />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-8 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400 sm:text-xs">
            Partnership
          </p>

          <h2 className="mt-3 max-w-[520px] text-[clamp(2.25rem,3.8vw,3.55rem)] font-black leading-[1.06] tracking-[-0.038em] text-white">
            Build meaningful partnerships for shared growth.
          </h2>

          <p className="mt-4 max-w-[520px] text-sm leading-7 text-slate-400 sm:text-base">
            EZ Life welcomes collaboration with trusted service providers and partners who value quality, transparency and long-term member value.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map(([title, description, Icon]) => (
              <article
                key={title}
                className="min-h-[116px] rounded-2xl border border-white/10 bg-white/[0.045] p-4"
              >
                <Icon className="h-5 w-5 text-violet-300" />
                <h3 className="mt-3 text-sm font-black text-white sm:text-base">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px] w-full overflow-hidden rounded-[1.6rem] border border-white/10 sm:min-h-[390px] lg:min-h-[455px]">
          <Image
            src="/photo-partnership-final.jpg"
            alt="Partnership"
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
