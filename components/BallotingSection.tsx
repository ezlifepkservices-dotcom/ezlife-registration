import { BadgeCheck, CheckCircle2, ListChecks, Target, Trophy } from "lucide-react";

const stages = [
  { title: "Package Rules", description: "Each package defines its own payment, referral and eligibility conditions.", icon: ListChecks },
  { title: "Eligibility Review", description: "The system checks KYC, purchase, payment and referral progress.", icon: BadgeCheck },
  { title: "Balloting Pool", description: "Only eligible members are included in the relevant event pool.", icon: Target },
  { title: "Result & Completion", description: "Winners and target-completed members move to the next service stage.", icon: Trophy },
];

export default function BallotingSection() {
  return (
    <section id="balloting" className="bg-[#F8FAFF] py-20 text-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div><p className="text-sm font-black uppercase tracking-[0.2em] text-violet-700">Balloting Process</p><h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Eligibility is based on actual package rules.</h2><p className="mt-5 leading-8 text-slate-600">Balloting is not a fixed one-rule process. Each active package can have its own referral start target, payment conditions and completion target.</p><div className="mt-7 rounded-2xl border border-violet-200 bg-violet-50 p-5"><div className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-violet-700" /><p className="leading-7 text-slate-700">Members can view what is complete, what is pending and how many referrals remain for the selected package.</p></div></div></div>
        <div className="grid gap-4 sm:grid-cols-2">{stages.map((stage,index)=>{const Icon=stage.icon;return <article key={stage.title} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#172B63] to-[#6D3BFF] text-white"><Icon className="h-5 w-5" /></div><span className="text-xs font-black text-violet-700">0{index+1}</span></div><h3 className="mt-5 text-lg font-black">{stage.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{stage.description}</p></article>})}</div>
      </div></div>
    </section>
  );
}
