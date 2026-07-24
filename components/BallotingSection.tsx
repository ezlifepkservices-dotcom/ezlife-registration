import Image from "next/image";
import { BadgeCheck, ListChecks, Target, Trophy } from "lucide-react";

const items = [
  ["Package Rules", "Conditions come from the selected package.", ListChecks],
  ["Eligibility Review", "KYC, payments and referrals are checked.", BadgeCheck],
  ["Balloting Pool", "Only eligible members enter the event pool.", Target],
  ["Result Tracking", "Results and completion remain recorded.", Trophy],
] as const;

export default function BallotingSection() {
  return (
    <section id="balloting" className="relative overflow-hidden bg-[#0F172A] py-14 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(109,59,255,0.13),transparent_34%)]" />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-9 px-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400 sm:text-xs">Balloting</p>

          <h2 className="mt-3 max-w-[540px] text-[clamp(2.35rem,4vw,3.75rem)] font-black leading-[1.06] tracking-[-0.038em] text-white">
            Fair balloting, real opportunities.
          </h2>

          <p className="mt-4 max-w-[540px] text-sm leading-7 text-slate-400 sm:text-base sm:leading-7">
            Each package can define its own payment, referral and completion conditions before a member enters the relevant balloting pool.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map(([title,description,Icon]) => (
              <article key={title} className="min-h-[118px] rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <Icon className="h-5 w-5 text-violet-300" />
                <h3 className="mt-3 text-sm font-black text-white sm:text-base">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative min-h-[310px] w-full overflow-hidden rounded-[1.6rem] border border-white/10 sm:min-h-[390px] lg:min-h-[470px]">
          <Image
            src="/photo-balloting.jpg"
            alt="Balloting"
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
