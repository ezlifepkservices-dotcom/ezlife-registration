"use client";

import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCcw,
  Search,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type PurchaseStatus = "pending" | "active" | "completed" | "cancelled";

type PurchaseRow = {
  id: string;
  member_id: string;
  service_id: string;
  purchase_code: string;
  purchase_date: string;
  payment_status: string;
  purchase_status: PurchaseStatus;
  balloting_status: string;
  admin_notes: string | null;
  approved_at: string | null;
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
  services:
    | { name: string | null }
    | { name: string | null }[]
    | null;
};

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function badgeClass(status: string) {
  const normalized = status.toLowerCase();

  if (["active", "approved", "completed", "paid", "verified"].includes(normalized)) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (["cancelled", "rejected", "overdue"].includes(normalized)) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-300";
}

export default function AdminPurchasesPage() {
  const [rows, setRows] = useState<PurchaseRow[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function loadData() {
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/admin/login";
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("auth_user_id", session.user.id)
        .single();

      if (
        profileError ||
        !profile ||
        profile.role !== "admin" ||
        profile.status !== "active"
      ) {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
        return;
      }

      const { data, error } = await supabase
        .from("purchases")
        .select(
          "id, member_id, service_id, purchase_code, purchase_date, payment_status, purchase_status, balloting_status, admin_notes, approved_at, members(full_name, email, mobile, referral_code), services(name)",
        )
        .order("purchase_date", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const records = (data ?? []) as PurchaseRow[];
      setRows(records);

      const initialNotes: Record<string, string> = {};
      for (const row of records) {
        initialNotes[row.id] = row.admin_notes ?? "";
      }
      setNotes(initialNotes);
    } catch (error) {
      console.error("Admin purchases load error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Purchase requests load nahi ho sakin.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) => {
      const member = one(row.members);
      const service = one(row.services);

      return [
        row.purchase_code,
        row.purchase_status,
        row.payment_status,
        row.balloting_status,
        member?.full_name ?? "",
        member?.email ?? "",
        member?.mobile ?? "",
        member?.referral_code ?? "",
        service?.name ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [rows, search]);

  async function updatePurchase(
    row: PurchaseRow,
    nextStatus: "active" | "cancelled",
  ) {
    setSavingId(row.id);

    try {
      const { data: userData } = await supabase.auth.getUser();

      const payload =
        nextStatus === "active"
          ? {
              purchase_status: "active",
              payment_status: "pending",
              admin_notes: notes[row.id]?.trim() || null,
              approved_by: userData.user?.id ?? null,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : {
              purchase_status: "cancelled",
              admin_notes:
                notes[row.id]?.trim() || "Purchase request cancelled by admin.",
              approved_by: userData.user?.id ?? null,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

      const { error } = await supabase
        .from("purchases")
        .update(payload)
        .eq("id", row.id);

      if (error) {
        throw new Error(error.message);
      }

      toast.success(
        nextStatus === "active"
          ? "Purchase approved. Member can proceed to payment."
          : "Purchase request cancelled.",
      );

      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Purchase update nahi ho saki.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
              Admin Approval
            </p>
            <h1 className="mt-3 text-3xl font-black">Purchase Requests</h1>
            <p className="mt-2 text-slate-400">
              Pending purchase request approve hone ke baad member payment upload kar sakega.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 font-bold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <div className="relative mt-7 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search purchase, member, email or product"
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-4 text-white outline-none focus:border-violet-400"
          />
        </div>

        <section className="mt-6 space-y-4">
          {isLoading ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
              <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-violet-300" />
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center text-slate-500">
              No purchase request found.
            </div>
          ) : (
            filteredRows.map((row) => {
              const member = one(row.members);
              const service = one(row.services);
              const isPending = row.purchase_status === "pending";

              return (
                <article
                  key={row.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                        <ShoppingBag className="h-6 w-6" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
                          {row.purchase_code}
                        </p>

                        <h2 className="mt-2 text-xl font-black">
                          {service?.name ?? "EZ Life Service"}
                        </h2>

                        <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                          <p className="flex items-center gap-2">
                            <UserRound className="h-4 w-4 text-slate-600" />
                            {member?.full_name ?? "Unknown Member"}
                          </p>

                          <p className="break-all">
                            {member?.email ?? "No email"}
                          </p>

                          <p>{member?.mobile ?? "No mobile"}</p>

                          <p>
                            {new Date(row.purchase_date).toLocaleString("en-PK")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                          row.purchase_status,
                        )}`}
                      >
                        Purchase: {row.purchase_status.replaceAll("_", " ")}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                          row.payment_status,
                        )}`}
                      >
                        Payment: {row.payment_status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-sm font-bold text-slate-300">
                      Admin Notes
                    </label>
                    <textarea
                      value={notes[row.id] ?? ""}
                      onChange={(event) =>
                        setNotes((current) => ({
                          ...current,
                          [row.id]: event.target.value,
                        }))
                      }
                      rows={3}
                      disabled={!isPending}
                      placeholder="Optional approval instruction or cancellation reason"
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void updatePurchase(row, "cancelled")}
                          disabled={savingId === row.id}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-5 font-bold text-rose-300 transition hover:bg-rose-400/15 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel Request
                        </button>

                        <button
                          type="button"
                          onClick={() => void updatePurchase(row, "active")}
                          disabled={savingId === row.id}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-black text-white transition hover:bg-emerald-500 disabled:opacity-50"
                        >
                          {savingId === row.id ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Approve Purchase
                        </button>
                      </>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <Clock3 className="h-4 w-4" />
                        This request has already been processed.
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
