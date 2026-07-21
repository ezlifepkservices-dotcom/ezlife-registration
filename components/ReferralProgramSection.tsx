import Link from "next/link";
import { ArrowRight, CheckCircle2, Network, Share2, UserPlus, UsersRound } from "lucide-react";

const steps = [
  ["Receive Your Code", "Approved members receive a unique referral code.", UserPlus],
  ["Share Responsibly", "Invite people who are genuinely interested in EZ Life.", Share2],
  ["Track Approved Referrals", "Only approved referral records count toward progress.", UsersRound],
  ["Follow Package Targets", "Referral requirements depend on the selected package.", Network],
] as const;

export default function ReferralProgramSection() {
  return (
    <section id="referral" className="relative overflow-hidden bg-[#0F172A] py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(109,59,255,0.18),transparent_38%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div><p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">Referral Program</p><h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">Grow your network with<span className="block text-violet-300">clear, package-based targets.</span></h2><p className="mt-6 max-w-xl leading-8 text-slate-400">Referral progress is connected to the member&apos;s selected package. The dashboard shows approved referrals, balloting eligibility and the remaining target.</p>
          <div className="mt-7 space-y-3">{["Unique referral code for each approved member","Approved referral count visible in dashboard","Different packages can have different targets"].map((item)=><div key={item} className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="h-5 w-5 text-emerald-400" />{item}</div>)}</div>
          <Link href="/register" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-violet-600 px-6 font-bold text-white transition hover:-translate-y-1">Join EZ Life<ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">{steps.map(([title,description,Icon],index)=><article key={title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur"><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Icon className="h-5 w-5" /></div><span className="text-xs font-black text-slate-600">0{index+1}</span></div><h3 className="mt-5 text-lg font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}</div>
      </div>
    </section>
  );
}
