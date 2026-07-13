import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

import RegistrationFormComponent from "../../components/RegistrationForm";

function RegistrationFormFallback() {
  return (
    <div className="flex min-h-[520px] w-full items-center justify-center rounded-[2rem] border border-white/10 bg-[#111C35]/95 p-8 text-white shadow-[0_30px_100px_rgba(2,6,23,0.45)]">
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
    <main className="relative min-h-screen overflow-x-hidden bg-[#0F172A] px-4 py-8 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-10 h-[430px] w-[430px] rounded-full bg-[#172B63]/55 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[#6D3BFF]/25 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-base font-black text-white">
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
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-4 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#172B63] via-[#1A2555] to-[#6D3BFF] p-7 shadow-[0_30px_100px_rgba(2,6,23,0.45)] sm:p-9 lg:sticky lg:top-8">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#8C5CFF]/30 blur-3xl"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-100">
                <Sparkles size={14} />
                Membership Registration
              </div>

              <h1 className="mt-7 text-3xl font-black leading-tight text-white sm:text-4xl">
                Begin your journey with EZ Life.
              </h1>

              <p className="mt-5 leading-8 text-violet-100/75">
                Complete the registration form with accurate information. Your
                application will be reviewed by the EZ Life administration
                team.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  "Secure digital registration",
                  "Application review by administration",
                  "Unique member referral system",
                  "Access to selected EZ Life services",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-violet-100"
                    />

                    <p className="text-sm font-semibold leading-6 text-white">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-9 rounded-2xl border border-white/15 bg-white/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-100/70">
                  Application Status
                </p>

                <p className="mt-2 text-lg font-black text-white">
                  Submitted → Pending Review → Approved
                </p>
              </div>
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
