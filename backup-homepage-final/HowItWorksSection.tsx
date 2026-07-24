import Link from "next/link";
import { BadgeCheck, CreditCard, PackageCheck, UserPlus } from "lucide-react";

const steps = [
  { number: "01", title: "Register Your Interest", description: "Submit your basic information and select the service category you are interested in.", icon: UserPlus, href: "/register" },
  { number: "02", title: "Complete Verification", description: "After approval, sign in and complete KYC for account verification.", icon: BadgeCheck, href: "/login" },
  { number: "03", title: "Choose a Package", description: "Open the member portal, select an available service and then choose its package.", icon: PackageCheck, href: "/login" },
  { number: "04", title: "Track Your Progress", description: "Submit payments, follow referrals and monitor eligibility from your dashboard.", icon: CreditCard, href: "/login" },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#F8FAFF] py-20 text-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-black uppercase tracking-[0.2em] text-violet-700">How It Works</p><h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">A clear journey from interest to participation.</h2><p className="mt-5 leading-7 text-slate-600">Every important step is visible inside the EZ Life member dashboard.</p></div>
        <div className="relative mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent xl:block" />
          {steps.map((step) => { const Icon = step.icon; return <Link key={step.number} href={step.href} className="group relative rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"><div className="flex items-center justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#172B63] to-[#6D3BFF] text-white"><Icon className="h-6 w-6" /></div><span className="text-sm font-black text-violet-700">{step.number}</span></div><h3 className="mt-6 text-xl font-black">{step.title}</h3><p className="mt-3 leading-7 text-slate-600">{step.description}</p></Link>; })}
        </div>
      </div>
    </section>
  );
}
