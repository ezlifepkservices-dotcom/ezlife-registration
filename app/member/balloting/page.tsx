"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Gift,
  LoaderCircle,
  RefreshCcw,
  Target,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type EligibilityRow = {
  id: string;
  qualification_status: string;
  direct_referrals: number;
  verified_payments: number;
  paid_amount: number;
  remaining_referrals: number;
  remaining_payments: number;
  remaining_amount: number;
  remaining_family_members: number;
  missing_reasons: string[];
  evaluated_at: string;
  balloting_criteria:
    | {
        criterion_name: string;
        criterion_mode: string;
        benefit_type: string;
        min_direct_referrals: number;
        min_verified_payments: number;
        min_paid_amount: number;
        waive_installments_immediately: boolean;
        waive_installments_after_win: boolean;
      }
    | {
        criterion_name: string;
        criterion_mode: string;
        benefit_type: string;
        min_direct_referrals: number;
        min_verified_payments: number;
        min_paid_amount: number;
        waive_installments_immediately: boolean;
        waive_installments_after_win: boolean;
      }[]
    | null;
  product_packages:
    | {
        package_name: string;
        installment_amount: number;
      }
    | {
        package_name: string;
        installment_amount: number;
      }[]
    | null;
};

const one = <T,>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? value[0] ?? null : value;

function badge(status: string) {
  if (status === "eligible") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "direct_award") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }

  if (status === "nearly_eligible") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return "border-slate-700 bg-slate-800 text-slate-400";
}

export default function MemberBallotingPage() {
  const router = useRouter();
  const [rows, setRows] = useState<EligibilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/member/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("member_id, role, status")
        .eq("auth_user_id", session.user.id)
        .single();

      if (
        profileError ||
        !profile ||
        profile.role !== "member" ||
        profile.status !== "active" ||
        !profile.member_id
      ) {
        await supabase.auth.signOut();
        router.replace("/member/login");
        return;
      }

      const { error: refreshError } = await supabase.rpc(
        "refresh_balloting_eligibility",
        {
          input_member_id: profile.member_id,
        },
      );

      if (refreshError) throw new Error(refreshError.message);

      const { data, error } = await supabase
        .from("member_criterion_eligibility")
        .select(
          "id, qualification_status, direct_referrals, verified_payments, paid_amount, remaining_referrals, remaining_payments, remaining_amount, remaining_family_members, missing_reasons, evaluated_at, balloting_criteria(criterion_name, criterion_mode, benefit_type, min_direct_referrals, min_verified_payments, min_paid_amount, waive_installments_immediately, waive_installments_after_win), product_packages(package_name, installment_amount)",
        )
        .eq("member_id", profile.member_id)
        .order("evaluated_at", { ascending: false });

      if (error) throw new Error(error.message);

      setRows((data ?? []) as EligibilityRow[]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Balloting progress load nahi hua.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
    toast.success("Balloting eligibility refreshed.");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <LoaderCircle className="h-8 w-8 animate-spin text-violet-300" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/member/dashboard")}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold disabled:opacity-50"
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Progress
          </button>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Gift className="h-7 w-7 text-violet-300" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Dynamic Eligibility
              </p>
              <h1 className="mt-1 text-3xl font-black">
                My Balloting & Direct Award Progress
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Har product aur criterion ka progress automatically calculate hota
            hai. Yahan aap dekh sakte hain ke eligibility ke liye kya remaining
            hai.
          </p>
        </section>

        <div className="mt-6 space-y-5">
          {rows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center text-slate-500">
              No active balloting criterion is available.
            </div>
          ) : (
            rows.map((row) => {
              const criterion = one(row.balloting_criteria);
              const product = one(row.product_packages);
              const referralTarget = criterion?.min_direct_referrals ?? 0;
              const referralPercent =
                referralTarget > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (row.direct_referrals / referralTarget) * 100,
                      ),
                    )
                  : 100;

              return (
                <article
                  key={row.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
                        {product?.package_name ?? "EZ Life Package"}
                      </p>
                      <h2 className="mt-2 text-xl font-black">
                        {criterion?.criterion_name ?? "Eligibility Criterion"}
                      </h2>
                      <p className="mt-2 text-sm capitalize text-slate-500">
                        Benefit:{" "}
                        {criterion?.benefit_type.replaceAll("_", " ") ?? "—"}
                      </p>
                    </div>

                    <span
                      className={`self-start rounded-full border px-3 py-1 text-xs font-bold capitalize ${badge(
                        row.qualification_status,
                      )}`}
                    >
                      {row.qualification_status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <Target className="h-5 w-5 text-violet-300" />
                      <p className="mt-3 text-sm text-slate-500">
                        Direct Referrals
                      </p>
                      <p className="mt-1 text-2xl font-black">
                        {row.direct_referrals} / {referralTarget}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      <p className="mt-3 text-sm text-slate-500">
                        Verified Payments
                      </p>
                      <p className="mt-1 text-2xl font-black">
                        {row.verified_payments}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <Trophy className="h-5 w-5 text-cyan-300" />
                      <p className="mt-3 text-sm text-slate-500">
                        Paid Amount
                      </p>
                      <p className="mt-1 text-2xl font-black">
                        PKR {Number(row.paid_amount).toLocaleString("en-PK")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Referral Progress</span>
                      <span className="font-bold text-violet-300">
                        {referralPercent}%
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${referralPercent}%` }}
                      />
                    </div>
                  </div>

                  {row.missing_reasons?.length > 0 ? (
                    <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Remaining for Eligibility
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-amber-100">
                        {row.missing_reasons.map((reason) => (
                          <li key={reason}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-200">
                      {row.qualification_status === "direct_award"
                        ? "Congratulations. You qualify for a direct award under this criterion."
                        : "Congratulations. Your name qualifies for the eligible balloting pool."}
                    </div>
                  )}

                  {criterion?.waive_installments_immediately && (
                    <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm font-bold text-cyan-200">
                      This criterion waives installments immediately after
                      qualification.
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
