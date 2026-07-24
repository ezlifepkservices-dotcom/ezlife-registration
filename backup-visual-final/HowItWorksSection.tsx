import Link from "next/link";
import { BadgeCheck, CreditCard, PackageCheck, UserPlus } from "lucide-react";

const steps = [
  ["01", "Register Interest", "Submit your details and select an area of interest.", UserPlus, "/register"],
  ["02", "Complete Verification", "After approval, sign in and complete KYC.", BadgeCheck, "/login"],
  ["03", "Choose a Package", "Select an available service and then its package.", PackageCheck, "/login"],
  ["04", "Track Your Progress", "Follow payments, referrals and eligibility in your dashboard.", CreditCard, "/login"],
] as const;

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#0F172A] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
            How It Works
          </p>
          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            A simple and trackable process.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(([number, title, description, Icon, href]) => (
            <Link
              key={number}
              href={href}
              className="group rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-2 hover:border-violet-400/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#172B63] to-[#6D3BFF] text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-black text-violet-300">{number}</span>
              </div>
              <h3 className="mt-6 text-xl font-black text-white">{title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
