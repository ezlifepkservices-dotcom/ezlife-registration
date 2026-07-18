"use client";

import {
  ArrowLeft,
  Edit3,
  LoaderCircle,
  PackagePlus,
  RefreshCcw,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type ServiceRow = {
  id: string;
  name: string;
};

type PackageRow = {
  id: string;
  service_id: string;
  package_code: string;
  package_name: string;
  description: string | null;
  total_price: number;
  installment_amount: number;
  installment_count: number;
  family_allowed: boolean;
  min_family_members: number | null;
  max_family_members: number | null;
  balloting_start_referrals: number;
  completion_target_referrals: number;
  waive_installments_on_target: boolean;
  stop_balloting_on_target: boolean;
  activate_entitlement_on_target: boolean;
  is_active: boolean;
  display_order: number;
  services: { name: string | null } | { name: string | null }[] | null;
};

const emptyForm = {
  service_id: "",
  package_code: "",
  package_name: "",
  description: "",
  total_price: "0",
  installment_amount: "0",
  installment_count: "0",
  family_allowed: false,
  min_family_members: "",
  max_family_members: "",
  balloting_start_referrals: "0",
  completion_target_referrals: "0",
  waive_installments_on_target: true,
  stop_balloting_on_target: true,
  activate_entitlement_on_target: true,
  is_active: true,
  display_order: "0",
};

const one = <T,>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? value[0] ?? null : value;

export default function AdminPackagesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);

    try {
      const [serviceResult, packageResult] = await Promise.all([
        supabase.from("services").select("id,name").order("name"),
        supabase
          .from("product_packages")
          .select(
            "id,service_id,package_code,package_name,description,total_price,installment_amount,installment_count,family_allowed,min_family_members,max_family_members,balloting_start_referrals,completion_target_referrals,waive_installments_on_target,stop_balloting_on_target,activate_entitlement_on_target,is_active,display_order,services(name)",
          )
          .order("display_order"),
      ]);

      if (serviceResult.error) {
        throw new Error(serviceResult.error.message);
      }

      if (packageResult.error) {
        throw new Error(packageResult.error.message);
      }

      const serviceRows = (serviceResult.data ?? []) as ServiceRow[];

      setServices(serviceRows);
      setPackages((packageResult.data ?? []) as PackageRow[]);

      if (serviceRows[0]) {
        setForm((current) => ({
          ...current,
          service_id: current.service_id || serviceRows[0].id,
        }));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Packages load nahi huay.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      service_id: services[0]?.id ?? "",
    });
  }

  function editPackage(row: PackageRow) {
    setEditingId(row.id);
    setForm({
      service_id: row.service_id,
      package_code: row.package_code,
      package_name: row.package_name,
      description: row.description ?? "",
      total_price: String(row.total_price ?? 0),
      installment_amount: String(row.installment_amount ?? 0),
      installment_count: String(row.installment_count ?? 0),
      family_allowed: row.family_allowed,
      min_family_members: row.min_family_members
        ? String(row.min_family_members)
        : "",
      max_family_members: row.max_family_members
        ? String(row.max_family_members)
        : "",
      balloting_start_referrals: String(
        row.balloting_start_referrals ?? 0,
      ),
      completion_target_referrals: String(
        row.completion_target_referrals ?? 0,
      ),
      waive_installments_on_target:
        row.waive_installments_on_target,
      stop_balloting_on_target: row.stop_balloting_on_target,
      activate_entitlement_on_target:
        row.activate_entitlement_on_target,
      is_active: row.is_active,
      display_order: String(row.display_order ?? 0),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function savePackage(event: React.FormEvent) {
    event.preventDefault();

    if (
      !form.service_id ||
      !form.package_code.trim() ||
      !form.package_name.trim()
    ) {
      toast.error("Service, package code aur package name required hain.");
      return;
    }

    const startTarget = Number(form.balloting_start_referrals || 0);
    const completionTarget = Number(
      form.completion_target_referrals || 0,
    );

    if (
      completionTarget > 0 &&
      completionTarget < startTarget
    ) {
      toast.error(
        "Completion target balloting start referral se kam nahi ho sakta.",
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        service_id: form.service_id,
        package_code: form.package_code.trim().toUpperCase(),
        package_name: form.package_name.trim(),
        description: form.description.trim() || null,
        total_price: Number(form.total_price || 0),
        installment_amount: Number(form.installment_amount || 0),
        installment_count: Number(form.installment_count || 0),
        family_allowed: form.family_allowed,
        min_family_members:
          form.family_allowed && form.min_family_members
            ? Number(form.min_family_members)
            : null,
        max_family_members:
          form.family_allowed && form.max_family_members
            ? Number(form.max_family_members)
            : null,
        balloting_start_referrals: startTarget,
        completion_target_referrals: completionTarget,
        waive_installments_on_target:
          form.waive_installments_on_target,
        stop_balloting_on_target: form.stop_balloting_on_target,
        activate_entitlement_on_target:
          form.activate_entitlement_on_target,
        is_active: form.is_active,
        display_order: Number(form.display_order || 0),
        updated_at: new Date().toISOString(),
      };

      const result = editingId
        ? await supabase
            .from("product_packages")
            .update(payload)
            .eq("id", editingId)
        : await supabase.from("product_packages").insert(payload);

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success(
        editingId ? "Package updated." : "New package created.",
      );

      resetForm();
      await supabase.rpc("refresh_balloting_eligibility", {
        input_member_id: null,
      });
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Package save nahi hua.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePackage(row: PackageRow) {
    const confirmed = window.confirm(
      `${row.package_name} delete karna hai? Linked criteria/purchases hon to database deletion block kar sakta hai.`,
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("product_packages")
      .delete()
      .eq("id", row.id);

    if (error) {
      toast.error(
        `${error.message}. Package ko delete karne ke bajaye inactive kar sakte hain.`,
      );
      return;
    }

    toast.success("Package deleted.");
    await load();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin/balloting"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Balloting
          </Link>

          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
            Product & Package Master
          </p>
          <h1 className="mt-2 text-3xl font-black">
            Packages, Pricing & Referral Targets
          </h1>
          <p className="mt-3 max-w-4xl leading-7 text-slate-400">
            Har package ka payment amount, balloting start referral aur
            completion target yahan define hoga. Target complete hone par
            installments waive, balloting stop aur package entitlement active
            ho sakta hai.
          </p>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={savePackage}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center gap-3">
              <PackagePlus className="h-5 w-5 text-violet-300" />
              <h2 className="text-xl font-black">
                {editingId ? "Edit Package" : "Create Package"}
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              <label>
                <span className="text-sm font-bold">Service *</span>
                <select
                  value={form.service_id}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      service_id: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-bold">Package Code *</span>
                  <input
                    value={form.package_code}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        package_code: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                    placeholder="UMRAH-INDIVIDUAL"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold">Display Order</span>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        display_order: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>
              </div>

              <label>
                <span className="text-sm font-bold">Package Name *</span>
                <input
                  value={form.package_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      package_name: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                />
              </label>

              <label>
                <span className="text-sm font-bold">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label>
                  <span className="text-sm font-bold">Total Price</span>
                  <input
                    type="number"
                    min="0"
                    value={form.total_price}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        total_price: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold">
                    Installment Amount
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.installment_amount}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        installment_amount: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold">
                    Total Installments
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.installment_count}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        installment_count: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-bold">
                    Balloting Start Referrals
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.balloting_start_referrals}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        balloting_start_referrals: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold">
                    Completion Target Referrals
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.completion_target_referrals}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        completion_target_referrals: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.family_allowed}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        family_allowed: event.target.checked,
                      }))
                    }
                  />
                  Family package
                </label>

                {form.family_allowed && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                        className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4"
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
                        className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                {[
                  [
                    "waive_installments_on_target",
                    "Waive remaining installments when target completes",
                  ],
                  [
                    "stop_balloting_on_target",
                    "Stop future balloting when target completes",
                  ],
                  [
                    "activate_entitlement_on_target",
                    "Activate package entitlement when target completes",
                  ],
                  ["is_active", "Package is active"],
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
                            | "waive_installments_on_target"
                            | "stop_balloting_on_target"
                            | "activate_entitlement_on_target"
                            | "is_active"
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

              <div className="flex flex-col gap-3 sm:flex-row">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="min-h-12 rounded-xl border border-slate-700 bg-slate-950 px-5 font-bold"
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black disabled:opacity-50"
                >
                  {saving ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {editingId ? "Update Package" : "Create Package"}
                </button>
              </div>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">Configured Packages</h2>

            <div className="mt-6 space-y-4">
              {loading ? (
                <LoaderCircle className="mx-auto h-7 w-7 animate-spin" />
              ) : packages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
                  No package found.
                </div>
              ) : (
                packages.map((row) => (
                  <article
                    key={row.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
                          {row.package_code}
                        </p>
                        <h3 className="mt-2 text-lg font-black">
                          {row.package_name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {one(row.services)?.name ?? "Unknown Service"}
                        </p>
                      </div>

                      <span
                        className={`self-start rounded-full border px-3 py-1 text-xs font-bold ${
                          row.is_active
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : "border-slate-700 bg-slate-800 text-slate-500"
                        }`}
                      >
                        {row.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                      <p>
                        Installment: PKR{" "}
                        {Number(row.installment_amount).toLocaleString(
                          "en-PK",
                        )}
                      </p>
                      <p>Installments: {row.installment_count}</p>
                      <p>
                        Balloting starts:{" "}
                        {row.balloting_start_referrals} referrals
                      </p>
                      <p>
                        Completion target:{" "}
                        {row.completion_target_referrals} referrals
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => editPackage(row)}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-400/10 px-4 text-sm font-bold text-violet-200"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void deletePackage(row)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 text-sm font-bold text-rose-300"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
