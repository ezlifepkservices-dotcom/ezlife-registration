"use client";

import { Copy, Link2, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

type Props = {
  fullName: string;
  email: string;
  memberId: string;
  referralCode: string;
  status: string;
};

function Detail({
  label,
  value,
  breakAll = false,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wider text-slate-600">{label}</p>
      <p
        className={`mt-2 text-sm font-semibold text-slate-300 ${
          breakAll ? "break-all" : "break-words"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function MemberProfileCard({
  fullName,
  email,
  memberId,
  referralCode,
  status,
}: Props) {
  const referralLink =
    typeof window === "undefined"
      ? `/register?ref=${referralCode}`
      : `${window.location.origin}/register?ref=${referralCode}`;

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error(`${label} copy nahi ho saka.`);
    }
  }

  return (
    <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold">Membership Details</h3>
          <p className="mt-1 text-sm text-slate-500">
            Your account and referral information
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
          <UserRound className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 min-w-0 space-y-5">
        <Detail label="Full Name" value={fullName} />
        <Detail label="Email" value={email} breakAll />

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-600">
            Account Status
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold capitalize text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            {status}
          </div>
        </div>

        <Detail label="Member ID" value={memberId} breakAll />

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-slate-600">
            Referral Code
          </p>
          <div className="mt-2 flex min-w-0 items-center gap-2">
            <code className="min-w-0 flex-1 break-all rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm font-semibold text-violet-200">
              {referralCode}
            </code>
            <button
              type="button"
              onClick={() => void copy(referralCode, "Referral code")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-slate-600">
            Referral Link
          </p>
          <div className="mt-2 flex min-w-0 items-start gap-2">
            <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2">
              <div className="flex min-w-0 items-start gap-2">
                <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                <span className="min-w-0 break-all text-sm leading-6 text-slate-300">
                  {referralLink}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void copy(referralLink, "Referral link")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
