import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const points = [
  "Clear member journey from registration to service access",
  "Digital tracking for KYC, purchases, payments and progress",
  "Referral and balloting rules managed through one platform",
];

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#F8FAFF] py-20 text-slate-900 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-[0_30px_90px_rgba(30,41,59,0.16)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-[#172B63] via-[#253A78] to-[#6D3BFF]">
              <Image src="/ezlife-services-collage.png" alt="EZ Life lifestyle opportunities" fill sizes="(max-width: 1024px) 100vw, 560px" className="object-contain p-8" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/45 via-transparent to-white/5" />
            </div>
          </div>
          <div className="absolute -bottom-5 left-4 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><ShieldCheck className="h-5 w-5" /></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Member First</p><p className="font-black text-slate-900">Clear & Trackable Journey</p></div>
            </div>
          </div>
          <div className="absolute -right-2 top-8 hidden rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:block">
            <div className="flex items-center gap-3"><UsersRound className="h-5 w-5 text-violet-700" /><p className="font-bold">Community Driven</p></div>
          </div>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-700"><Sparkles className="h-4 w-4" />About EZ Life</div>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">A structured platform for<span className="block bg-gradient-to-r from-[#172B63] to-[#6D3BFF] bg-clip-text text-transparent">practical life opportunities.</span></h2>
          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">EZ Life is a digital membership platform designed to help individuals and families explore selected opportunities in Umrah, travel, home appliances and property through a clear, managed process.</p>
          <div className="mt-7 space-y-4">{points.map((point) => <div key={point} className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-violet-600" /><p className="leading-7 text-slate-700">{point}</p></div>)}</div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><HeartHandshake className="h-6 w-6 text-violet-600" /><h3 className="mt-3 font-black">Our Mission</h3><p className="mt-2 text-sm leading-6 text-slate-600">Make participation simple, transparent and easier to manage.</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><ShieldCheck className="h-6 w-6 text-violet-600" /><h3 className="mt-3 font-black">Our Approach</h3><p className="mt-2 text-sm leading-6 text-slate-600">Use technology, verification and clear progress tracking.</p></div>
          </div>
          <Link href="/register" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#172B63] to-[#6D3BFF] px-6 font-bold text-white shadow-lg transition hover:-translate-y-1">Start Your Journey<ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
