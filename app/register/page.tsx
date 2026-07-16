import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

import RegistrationFormComponent from "../../components/RegistrationForm";

function RegistrationFormFallback() {
  return (
    <div className="flex min-h-[520px] w-full items-center justify-center rounded-3xl border border-slate-700 bg-[#111C35] p-8 text-white shadow-xl">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-300">
          Loading registration form...
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0F172A] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6D3BFF] text-base font-black text-white">
              EZ
            </div>
            <div>
              <p className="text-xl font-black text-white">EZ Life</p>
              <p className="text-[9px] uppercase tracking-[0.22em] text-violet-300">
                Empowering Possibilities
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-[#111827] px-4 text-sm font-bold text-slate-300 transition hover:bg-[#172033] hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8">
          <aside className="rounded-3xl border border-slate-700 bg-[#172B63] p-6 shadow-xl sm:p-8 lg:sticky lg:top-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#24396F] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-100">
              <Sparkles size={14} />
              Membership Registration
            </div>

            <h1 className="mt-7 text-3xl font-black leading-tight text-white sm:text-4xl">
              Begin your journey with EZ Life.
            </h1>

            <p className="mt-5 leading-8 text-violet-100/80">
              Complete the registration form with accurate information. Your
              application will be reviewed by the EZ Life administration team.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Secure digital registration",
                "Application review by administration",
                "Unique member referral system",
                "Access to selected EZ Life services",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#22366B] p-4"
                >
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 text-violet-100" />
                  <p className="text-sm font-semibold leading-6 text-white">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/15 bg-[#22366B] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-100/70">
                Application Status
              </p>
              <p className="mt-2 text-lg font-black text-white">
                Submitted → Pending Review → Approved
              </p>
            </div>
          </aside>

          <section className="w-full min-w-0">
            <Suspense fallback={<RegistrationFormFallback />}>
              <RegistrationFormComponent />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
