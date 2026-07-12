import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  QrCode,
  Share2,
  UsersRound,
} from "lucide-react";

const referralMembers = [
  {
    name: "Ahmed Ali",
    status: "Approved",
  },
  {
    name: "Sara Khan",
    status: "Approved",
  },
  {
    name: "Bilal Ahmed",
    status: "Pending",
  },
];

export default function ReferralCard() {
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
              <UsersRound size={27} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                Referral Progress
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Grow Your Network
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Invite members using your unique referral code and track your
                progress.
              </p>
            </div>
          </div>

          <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-bold text-violet-200">
            3 of 5 Complete
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-300">
              Referral Completion
            </p>

            <p className="text-sm font-black text-violet-300">60%</p>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF]" />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Your Referral Code
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="flex min-h-12 flex-1 items-center justify-between rounded-xl border border-white/10 bg-[#0F172A] px-4">
              <span className="font-mono text-lg font-black tracking-[0.18em] text-white">
                EZ12345
              </span>

              <Copy size={18} className="text-violet-300" />
            </div>

            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-5 text-sm font-bold text-white transition hover:-translate-y-1"
            >
              <Share2 size={17} />
              Share Code
            </button>

            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
            >
              <QrCode size={18} />
              QR Code
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-black text-white">
              Recent Referrals
            </h3>

            <Link
              href="/dashboard/referrals"
              className="inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition hover:text-white"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {referralMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D3BFF]/80 to-[#172B63] text-sm font-black text-white">
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    <p className="font-bold text-white">{member.name}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Joined through your code
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                    member.status === "Approved"
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {member.status === "Approved" && (
                    <CheckCircle2 size={14} />
                  )}

                  {member.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}