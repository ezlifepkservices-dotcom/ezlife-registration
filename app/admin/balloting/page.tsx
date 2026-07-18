"use client";

import {
  ArrowLeft,
  CheckCircle2,
  DatabaseZap,
  Gift,
  LoaderCircle,
  PackagePlus,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Trophy,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type PackageRow = {
  id: string;
  package_code: string;
  package_name: string;
  installment_amount: number;
  installment_count: number;
  family_allowed: boolean;
  is_active: boolean;
  services: { name: string | null } | { name: string | null }[] | null;
};

type CriterionRow = {
  id: string;
  package_id: string;
  criterion_code: string;
  criterion_name: string;
  criterion_mode: "balloting" | "direct_award";
  benefit_type: string;
  min_direct_referrals: number;
  min_verified_payments: number;
  min_paid_amount: number;
  kyc_required: boolean;
  approved_purchase_required: boolean;
  payment_current_required: boolean;
  family_required: boolean;
  min_family_members: number | null;
  max_family_members: number | null;
  entry_count: number;
  waive_installments_immediately: boolean;
  waive_installments_after_win: boolean;
  priority: number;
  is_active: boolean;
  product_packages:
    | { package_name: string }
    | { package_name: string }[]
    | null;
};

type EligibilityRow = {
  id: string;
  member_id: string;
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
  members:
    | {
        full_name: string;
        email: string;
        mobile: string | null;
        referral_code: string;
      }
    | {
        full_name: string;
        email: string;
        mobile: string | null;
        referral_code: string;
      }[]
    | null;
  balloting_criteria:
    | {
        criterion_name: string;
        criterion_mode: string;
        benefit_type: string;
      }
    | {
        criterion_name: string;
        criterion_mode: string;
        benefit_type: string;
      }[]
    | null;
};

const one = <T,>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? value[0] ?? null : value;

function statusClass(status: string) {
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

export default function AdminBallotingPage() {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [criteria, setCriteria] = useState<CriterionRow[]>([]);
  const [eligibility, setEligibility] = useState<EligibilityRow[]>([]);
  const [activeTab, setActiveTab] = useState<
    "criteria" | "eligible" | "nearly" | "excluded" | "target"
  >("criteria");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [form, setForm] = useState({
    package_id: "",
    criterion_code: "",
    criterion_name: "",
    criterion_mode: "balloting",
    benefit_type: "balloting_entry",
    min_direct_referrals: "0",
    min_verified_payments: "0",
    min_paid_amount: "0",
    kyc_required: true,
    approved_purchase_required: true,
    payment_current_required: false,
    family_required: false,
    min_family_members: "",
    max_family_members: "",
    entry_count: "1",
    waive_installments_immediately: false,
    waive_installments_after_win: false,
    priority: "100",
  });

  async function loadData() {
    setIsLoading(true);

    try {
      const [packageResult, criteriaResult, eligibilityResult] =
        await Promise.all([
          supabase
            .from("product_packages")
            .select(
              "id, package_code, package_name, installment_amount, installment_count, family_allowed, is_active, services(name)",
            )
            .order("display_order"),

          supabase
            .from("balloting_criteria")
            .select(
              "id, package_id, criterion_code, criterion_name, criterion_mode, benefit_type, min_direct_referrals, min_verified_payments, min_paid_amount, kyc_required, approved_purchase_required, payment_current_required, family_required, min_family_members, max_family_members, entry_count, waive_installments_immediately, waive_installments_after_win, priority, is_active, product_packages(package_name)",
            )
            .order("priority"),

          supabase
            .from("member_criterion_eligibility")
            .select(
              "id, member_id, qualification_status, direct_referrals, verified_payments, paid_amount, remaining_referrals, remaining_payments, remaining_amount, remaining_family_members, missing_reasons, evaluated_at, members(full_name, email, mobile, referral_code), balloting_criteria(criterion_name, criterion_mode, benefit_type)",
            )
            .order("evaluated_at", { ascending: false }),
        ]);

      if (packageResult.error) throw new Error(packageResult.error.message);
      if (criteriaResult.error) throw new Error(criteriaResult.error.message);
      if (eligibilityResult.error) {
        throw new Error(eligibilityResult.error.message);
      }

      const packageRows = (packageResult.data ?? []) as PackageRow[];

      setPackages(packageRows);
      setCriteria((criteriaResult.data ?? []) as CriterionRow[]);
      setEligibility((eligibilityResult.data ?? []) as EligibilityRow[]);

      if (packageRows[0]) {
        setForm((current) => ({
          ...current,
          package_id: current.package_id || packageRows[0].id,
        }));
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Balloting data load nahi hua.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function refreshEligibility() {
    setIsRefreshing(true);

    try {
      const { data, error } = await supabase.rpc(
        "refresh_balloting_eligibility",
        {
          input_member_id: null,
        },
      );

      if (error) throw new Error(error.message);

      toast.success(`${data ?? 0} eligibility records recalculated.`);
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Eligibility refresh nahi hui.",
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  async function createCriterion(event: React.FormEvent) {
    event.preventDefault();

    if (
      !form.package_id ||
      !form.criterion_code.trim() ||
      !form.criterion_name.trim()
    ) {
      toast.error("Package, criterion code aur name required hain.");
      return;
    }

    const { error } = await supabase.from("balloting_criteria").insert({
      package_id: form.package_id,
      criterion_code: form.criterion_code.trim().toUpperCase(),
      criterion_name: form.criterion_name.trim(),
      criterion_mode: form.criterion_mode,
      benefit_type: form.benefit_type,
      conditions_mode: "all",
      min_direct_referrals: 0,
      min_verified_payments: Number(form.min_verified_payments || 0),
      min_paid_amount: Number(form.min_paid_amount || 0),
      kyc_required: form.kyc_required,
      approved_purchase_required: form.approved_purchase_required,
      payment_current_required: form.payment_current_required,
      family_required: form.family_required,
      min_family_members: form.min_family_members
        ? Number(form.min_family_members)
        : null,
      max_family_members: form.max_family_members
        ? Number(form.max_family_members)
        : null,
      entry_count:
        form.criterion_mode === "direct_award"
          ? 0
          : Number(form.entry_count || 1),
      waive_installments_immediately:
        form.waive_installments_immediately,
      waive_installments_after_win: form.waive_installments_after_win,
      priority: Number(form.priority || 100),
      is_active: true,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("New balloting criterion created.");

    setForm((current) => ({
      ...current,
      criterion_code: "",
      criterion_name: "",
      min_direct_referrals: "0",
      min_verified_payments: "0",
      min_paid_amount: "0",
      family_required: false,
      min_family_members: "",
      max_family_members: "",
      entry_count: "1",
      waive_installments_immediately: false,
      waive_installments_after_win: false,
      priority: "100",
    }));

    await refreshEligibility();
  }

  async function toggleCriterion(row: CriterionRow) {
    const { error } = await supabase
      .from("balloting_criteria")
      .update({
        is_active: !row.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(row.is_active ? "Criterion disabled." : "Criterion enabled.");
    await refreshEligibility();
  }

  const filteredEligibility = useMemo(() => {
    const query = search.trim().toLowerCase();

    return eligibility.filter((row) => {
      if (
        activeTab === "eligible" &&
        row.qualification_status !== "eligible"
      ) {
        return false;
      }

      if (
        activeTab === "nearly" &&
        row.qualification_status !== "nearly_eligible"
      ) {
        return false;
      }

      if (
        activeTab === "excluded" &&
        row.qualification_status !== "not_eligible"
      ) {
        return false;
      }

      if (
        activeTab === "target" &&
        row.qualification_status !== "target_completed"
      ) {
        return false;
      }

      const member = one(row.members);
      const criterion = one(row.balloting_criteria);

      if (!query) return true;

      return [
        member?.full_name ?? "",
        member?.email ?? "",
        member?.mobile ?? "",
        member?.referral_code ?? "",
        criterion?.criterion_name ?? "",
        row.qualification_status,
        ...(row.missing_reasons ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [activeTab, eligibility, search]);

  const counts = useMemo(
    () => ({
      eligible: eligibility.filter(
        (row) => row.qualification_status === "eligible",
      ).length,
      nearly: eligibility.filter(
        (row) => row.qualification_status === "nearly_eligible",
      ).length,
      excluded: eligibility.filter(
        (row) => row.qualification_status === "not_eligible",
      ).length,
      target: eligibility.filter(
        (row) => row.qualification_status === "target_completed",
      ).length,
    }),
    [eligibility],
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Dynamic Rule Engine
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Balloting Criteria & Eligibility
            </h1>
            <p className="mt-2 max-w-3xl text-slate-400">
              Client apne referral, payment, family, direct award aur waiver
              criteria yahan manage kar sakta hai.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/packages"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-400/10 px-5 font-black text-violet-200"
            >
              <PackagePlus className="h-4 w-4" />
              Manage Packages
            </Link>

            <button
              type="button"
              onClick={() => void refreshEligibility()}
              disabled={isRefreshing}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 font-black disabled:opacity-50"
            >
            {isRefreshing ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <DatabaseZap className="h-4 w-4" />
            )}
              Recalculate Eligibility
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Eligible for Balloting",
              value: counts.eligible,
              icon: UsersRound,
            },
            {
              label: "Nearly Eligible",
              value: counts.nearly,
              icon: RefreshCcw,
            },
            {
              label: "Not Eligible",
              value: counts.excluded,
              icon: Search,
            },
            {
              label: "Target Completed",
              value: counts.target,
              icon: Trophy,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <Icon className="h-5 w-5 text-violet-300" />
                <p className="mt-4 text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-black">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            ["criteria", "Criteria"],
            ["eligible", `Eligible (${counts.eligible})`],
            ["nearly", `Nearly Eligible (${counts.nearly})`],
            ["excluded", `Not Eligible (${counts.excluded})`],
            ["target", `Target Completed (${counts.target})`],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setActiveTab(
                  value as
                    | "criteria"
                    | "eligible"
                    | "nearly"
                    | "excluded"
                    | "target",
                )
              }
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                activeTab === value
                  ? "bg-violet-600 text-white"
                  : "border border-slate-700 bg-slate-900 text-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "criteria" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <form
              onSubmit={createCriterion}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-violet-300" />
                <h2 className="text-xl font-black">Create New Criterion</h2>
              </div>

              <div className="mt-6 grid gap-4">
                <label>
                  <span className="text-sm font-bold">Product / Package *</span>
                  <select
                    value={form.package_id}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        package_id: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  >
                    {packages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.package_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="text-sm font-bold">Criterion Code *</span>
                  <input
                    value={form.criterion_code}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        criterion_code: event.target.value,
                      }))
                    }
                    placeholder="CRIT-UMRAH-NEW"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold">Criterion Name *</span>
                  <input
                    value={form.criterion_name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        criterion_name: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="text-sm font-bold">Mode</span>
                    <select
                      value={form.criterion_mode}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          criterion_mode: event.target.value,
                        }))
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                    >
                      <option value="balloting">Balloting</option>
                      <option value="direct_award">Direct Award</option>
                    </select>
                  </label>

                  <label>
                    <span className="text-sm font-bold">Benefit</span>
                    <select
                      value={form.benefit_type}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          benefit_type: event.target.value,
                        }))
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                    >
                      <option value="balloting_entry">Balloting Entry</option>
                      <option value="direct_umrah">Direct Umrah</option>
                      <option value="family_balloting">Family Balloting</option>
                      <option value="installment_waiver">
                        Installment Waiver
                      </option>
                      <option value="bonus_entries">Bonus Entries</option>
                      <option value="custom">Custom</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm text-violet-200">
                    Referral start and completion targets are managed in the Product / Package Master.
                  </div>

                  <label>
                    <span className="text-sm font-bold">
                      Minimum Verified Payments
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.min_verified_payments}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          min_verified_payments: event.target.value,
                        }))
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                    />
                  </label>
                </div>

                <label>
                  <span className="text-sm font-bold">
                    Minimum Paid Amount
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.min_paid_amount}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        min_paid_amount: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>

                <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  {[
                    ["kyc_required", "KYC must be approved"],
                    [
                      "approved_purchase_required",
                      "Approved purchase required",
                    ],
                    [
                      "payment_current_required",
                      "Payment account must be current",
                    ],
                    ["family_required", "Family profile required"],
                    [
                      "waive_installments_immediately",
                      "Waive installments immediately",
                    ],
                    [
                      "waive_installments_after_win",
                      "Waive installments after winning",
                    ],
                  ].map(([field, label]) => (
                    <label
                      key={field}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={
                          form[
                            field as
                              | "kyc_required"
                              | "approved_purchase_required"
                              | "payment_current_required"
                              | "family_required"
                              | "waive_installments_immediately"
                              | "waive_installments_after_win"
                          ]
                        }
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [field]: event.target.checked,
                          }))
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>

                {form.family_required && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-bold">
                        Minimum Family Members
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={form.min_family_members}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            min_family_members: event.target.value,
                          }))
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                      />
                    </label>

                    <label>
                      <span className="text-sm font-bold">
                        Maximum Family Members
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={form.max_family_members}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            max_family_members: event.target.value,
                          }))
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                      />
                    </label>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="text-sm font-bold">Entry Count</span>
                    <input
                      type="number"
                      min="0"
                      value={form.entry_count}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          entry_count: event.target.value,
                        }))
                      }
                      disabled={form.criterion_mode === "direct_award"}
                      className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 disabled:opacity-50"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-bold">Priority</span>
                    <input
                      type="number"
                      value={form.priority}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          priority: event.target.value,
                        }))
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                    />
                  </label>
                </div>

                <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black">
                  <Save className="h-5 w-5" />
                  Save Criterion
                </button>
              </div>
            </form>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-violet-300" />
                <h2 className="text-xl font-black">Configured Criteria</h2>
              </div>

              <div className="mt-6 space-y-4">
                {criteria.map((row) => (
                  <article
                    key={row.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
                          {row.criterion_code}
                        </p>
                        <h3 className="mt-2 text-lg font-black">
                          {row.criterion_name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {one(row.product_packages)?.package_name ??
                            "Unknown Package"}
                        </p>
                      </div>

                      <span
                        className={`self-start rounded-full border px-3 py-1 text-xs font-bold ${
                          row.is_active
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : "border-slate-700 bg-slate-800 text-slate-500"
                        }`}
                      >
                        {row.is_active ? "Active" : "Disabled"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                      <p>Mode: {row.criterion_mode.replaceAll("_", " ")}</p>
                      <p>Benefit: {row.benefit_type.replaceAll("_", " ")}</p>
                      <p>Direct referrals: {row.min_direct_referrals}</p>
                      <p>Verified payments: {row.min_verified_payments}</p>
                      <p>
                        Paid amount: PKR{" "}
                        {Number(row.min_paid_amount).toLocaleString("en-PK")}
                      </p>
                      <p>Entries: {row.entry_count}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void toggleCriterion(row)}
                      className="mt-4 min-h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold"
                    >
                      {row.is_active ? "Disable Criterion" : "Enable Criterion"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search member, referral code or criterion"
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4"
              />
            </div>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <LoaderCircle className="mx-auto h-7 w-7 animate-spin" />
              ) : filteredEligibility.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
                  No matching member found.
                </div>
              ) : (
                filteredEligibility.map((row) => {
                  const member = one(row.members);
                  const criterion = one(row.balloting_criteria);

                  return (
                    <article
                      key={row.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="flex flex-wrap justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-black">
                            {member?.full_name ?? "Unknown Member"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {member?.email ?? "No email"} ·{" "}
                            {member?.referral_code ?? "No referral code"}
                          </p>
                          <p className="mt-3 text-sm font-bold text-violet-300">
                            {criterion?.criterion_name ?? "Unknown Criterion"}
                          </p>
                        </div>

                        <span
                          className={`self-start rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass(
                            row.qualification_status,
                          )}`}
                        >
                          {row.qualification_status.replaceAll("_", " ")}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
                        <p>Referrals: {row.direct_referrals}</p>
                        <p>Verified payments: {row.verified_payments}</p>
                        <p>
                          Paid: PKR{" "}
                          {Number(row.paid_amount).toLocaleString("en-PK")}
                        </p>
                        <p>
                          Evaluated:{" "}
                          {new Date(row.evaluated_at).toLocaleString("en-PK")}
                        </p>
                      </div>

                      {row.missing_reasons?.length > 0 && (
                        <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                            Remaining Requirements
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-amber-100">
                            {row.missing_reasons.map((reason) => (
                              <li key={reason}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(row.qualification_status === "eligible" ||
                        row.qualification_status === "direct_award") && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                          <CheckCircle2 className="h-4 w-4" />
                          This member qualifies under this criterion.
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
