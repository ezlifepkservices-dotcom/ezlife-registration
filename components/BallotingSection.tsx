import {
  BadgeCheck,
  CheckCircle2,
  ListChecks,
  Target,
  Trophy,
} from "lucide-react";

const stages = [
  ["Package Rules", "Every package defines its own conditions.", ListChecks],
  ["Eligibility Review", "KYC, purchase, payment and referral progress are checked.", BadgeCheck],
  ["Balloting Pool", "Only eligible members enter the relevant event pool.", Target],
  ["Result & Completion", "Winners and target-completed members move forward.", Trophy],
] as const;

export default function BallotingSection() {
  return (
    <section id="balloting" className="bg-[#0F172A] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
              Balloting Process
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              Eligibility follows actual package rules.
            </h2>
            <p className="mt-5 leading-8 text-slate-400">
              Balloting is not based on one fixed rule. Each active package can define
              its own payment, referral and completion conditions.
            </p>

            <div className="mt-7 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-violet-300" />
                <p className="leading-7 text-violet-100/80">
                  Members can see what is complete, what is pending and what remains for
                  their selected package.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stages.map(([title, description, Icon], index) => (
              <article key={title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#172B63] to-[#6D3BFF] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black text-violet-300">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
