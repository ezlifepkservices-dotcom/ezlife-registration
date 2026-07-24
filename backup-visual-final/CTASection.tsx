import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  "Simple digital registration",
  "Member dashboard progress tracking",
  "Package-based purchase and payment flow",
];

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,59,255,0.2),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#172B63]/90 to-[#6D3BFF]/70 p-7 shadow-2xl sm:p-10 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-200">
                Ready to Begin?
              </p>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
                Register your interest and start your EZ Life journey.
              </h2>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-violet-100">
                    <CheckCircle2 className="h-4 w-4" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex min-w-[220px] flex-col gap-3">
              <Link
                href="/register"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-7 font-black text-[#172B63] transition hover:-translate-y-1"
              >
                Register Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 font-bold text-white"
              >
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
