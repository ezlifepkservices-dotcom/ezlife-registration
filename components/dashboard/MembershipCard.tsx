import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Crown,
  ShieldCheck,
} from "lucide-react";

export default function MembershipCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-8">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#6D3BFF]/20 blur-3xl"
      />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white shadow-[0_14px_40px_rgba(109,59,255,0.3)]">
              <Crown size={27} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                Membership Overview
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                EZ Life Premium Member
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your account is active and all current membership requirements
                are complete.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
            <CheckCircle2 size={17} />
            Active
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-3 text-slate-400">
              <ShieldCheck size={18} className="text-violet-300" />
              <span className="text-sm">Member ID</span>
            </div>

            <p className="mt-3 text-lg font-black text-white">EZ-000123</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-3 text-slate-400">
              <CalendarDays size={18} className="text-violet-300" />
              <span className="text-sm">Joining Date</span>
            </div>

            <p className="mt-3 text-lg font-black text-white">12 July 2026</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-3 text-slate-400">
              <CheckCircle2 size={18} className="text-violet-300" />
              <span className="text-sm">Profile Status</span>
            </div>

            <p className="mt-3 text-lg font-black text-white">Verified</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-300">
              Profile Completion
            </p>

            <p className="text-sm font-black text-violet-300">85%</p>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF]" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/profile"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-6 text-sm font-bold text-white transition hover:-translate-y-1"
          >
            Complete Profile
          </Link>

          <Link
            href="/dashboard/documents"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] px-6 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            View Documents
          </Link>
        </div>
      </div>
    </section>
  );
}