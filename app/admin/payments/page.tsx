"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  LoaderCircle,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ToggleLeft,
  ToggleRight,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Account = {
  id: string;
  account_type: string;
  account_title: string;
  bank_name: string | null;
  account_number: string | null;
  iban: string | null;
  mobile_number: string | null;
  branch_name: string | null;
  instructions: string | null;
  is_active: boolean;
  display_order: number;
};

type Payment = {
  id: string;
  purchase_id: string;
  payment_no: string;
  payment_method: string;
  amount: number;
  payment_date: string;
  reference_no: string | null;
  receipt_path: string;
  status: string;
  admin_notes: string | null;
  members:
    | { full_name: string; email: string }
    | { full_name: string; email: string }[]
    | null;
  purchases:
    | { purchase_code: string }
    | { purchase_code: string }[]
    | null;
};

const one = <T,>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? value[0] ?? null : value;

export default function AdminPaymentsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    account_type: "bank",
    account_title: "",
    bank_name: "",
    account_number: "",
    iban: "",
    mobile_number: "",
    branch_name: "",
    instructions: "",
  });

  async function load() {
    setLoading(true);

    try {
      const [accountResult, paymentResult] = await Promise.all([
        supabase
          .from("payment_accounts")
          .select("*")
          .order("display_order", { ascending: true }),

        supabase
          .from("payments")
          .select(
            "id,purchase_id,payment_no,payment_method,amount,payment_date,reference_no,receipt_path,status,admin_notes,members(full_name,email),purchases(purchase_code)",
          )
          .order("created_at", { ascending: false }),
      ]);

      if (accountResult.error) throw new Error(accountResult.error.message);
      if (paymentResult.error) throw new Error(paymentResult.error.message);

      const rows = (paymentResult.data ?? []) as Payment[];

      setAccounts((accountResult.data ?? []) as Account[]);
      setPayments(rows);

      const initialNotes: Record<string, string> = {};
      rows.forEach((row) => {
        initialNotes[row.id] = row.admin_notes ?? "";
      });
      setNotes(initialNotes);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payments load nahi huay.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return payments;

    return payments.filter((payment) =>
      [
        payment.payment_no,
        payment.status,
        payment.reference_no ?? "",
        one(payment.members)?.full_name ?? "",
        one(payment.members)?.email ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [payments, search]);

  async function saveAccount(event: React.FormEvent) {
    event.preventDefault();

    if (!form.account_title.trim()) {
      toast.error("Account title required hai.");
      return;
    }

    const { error } = await supabase.from("payment_accounts").insert({
      account_type: form.account_type,
      account_title: form.account_title.trim(),
      bank_name: form.bank_name.trim() || null,
      account_number: form.account_number.trim() || null,
      iban: form.iban.trim() || null,
      mobile_number: form.mobile_number.trim() || null,
      branch_name: form.branch_name.trim() || null,
      instructions: form.instructions.trim() || null,
      is_active: true,
      display_order: accounts.length,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Payment account saved.");

    setForm({
      account_type: "bank",
      account_title: "",
      bank_name: "",
      account_number: "",
      iban: "",
      mobile_number: "",
      branch_name: "",
      instructions: "",
    });

    await load();
  }

  async function toggleAccount(account: Account) {
    const { error } = await supabase
      .from("payment_accounts")
      .update({
        is_active: !account.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", account.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      !account.is_active
        ? "Account member side par visible ho gaya."
        : "Account member side se hide ho gaya.",
    );

    await load();
  }

  async function openReceipt(path: string) {
    const { data, error } = await supabase.storage
      .from("payment-receipts")
      .createSignedUrl(path, 600);

    if (error || !data?.signedUrl) {
      toast.error(error?.message ?? "Receipt open nahi hui.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function updatePayment(
    payment: Payment,
    status: "verified" | "rejected",
  ) {
    setSavingId(payment.id);

    try {
      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("payments")
        .update({
          status,
          admin_notes: notes[payment.id]?.trim() || null,
          reviewed_by: userData.user?.id ?? null,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      if (error) throw new Error(error.message);

      const { error: purchaseError } = await supabase
        .from("purchases")
        .update(
          status === "verified"
            ? {
                payment_status: "verified",
                balloting_status: "eligible",
                updated_at: new Date().toISOString(),
              }
            : {
                payment_status: "rejected",
                balloting_status: "not_eligible",
                updated_at: new Date().toISOString(),
              },
        )
        .eq("id", payment.purchase_id);

      if (purchaseError) throw new Error(purchaseError.message);

      toast.success(
        status === "verified"
          ? "Payment verified; balloting eligible."
          : "Payment rejected.",
      );

      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment update nahi hui.",
      );
    } finally {
      setSavingId(null);
    }
  }

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
              Finance
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Payments & Receiving Accounts
            </h1>
            <p className="mt-2 text-slate-400">
              Bank, JazzCash, Easypaisa aur multiple receiving methods manage
              karein.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-black">Configured Payment Methods</h2>
          <p className="mt-2 text-sm text-slate-500">
            Active accounts member payment page par show honge. Aap 2, 4 ya
            jitne accounts chahein save kar sakte hain.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accounts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                No payment account configured.
              </div>
            ) : (
              accounts.map((account) => (
                <article
                  key={account.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
                        {account.account_type.replaceAll("_", " ")}
                      </p>
                      <h3 className="mt-2 font-black">
                        {account.account_title}
                      </h3>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        account.is_active
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-slate-700 bg-slate-800 text-slate-500"
                      }`}
                    >
                      {account.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    {account.bank_name && <p>{account.bank_name}</p>}
                    {account.account_number && (
                      <p>Account: {account.account_number}</p>
                    )}
                    {account.iban && <p className="break-all">IBAN: {account.iban}</p>}
                    {account.mobile_number && (
                      <p>Mobile: {account.mobile_number}</p>
                    )}
                    {account.branch_name && <p>Branch: {account.branch_name}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={() => void toggleAccount(account)}
                    className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold"
                  >
                    {account.is_active ? (
                      <ToggleRight className="h-5 w-5 text-emerald-300" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-slate-500" />
                    )}
                    {account.is_active ? "Hide from Members" : "Show to Members"}
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-violet-300" />
              <h2 className="text-xl font-black">Add Payment Account</h2>
            </div>

            <form onSubmit={saveAccount} className="mt-6 grid gap-4">
              <label>
                <span className="text-sm font-bold">Account Type</span>
                <select
                  value={form.account_type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      account_type: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                >
                  <option value="bank">Bank</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="easypaisa">Easypaisa</option>
                  <option value="cash_deposit">Cash Deposit</option>
                  <option value="other">Other</option>
                </select>
              </label>

              {(
                [
                  ["account_title", "Account Title *"],
                  ["bank_name", "Bank / Wallet Name"],
                  ["account_number", "Account Number"],
                  ["iban", "IBAN"],
                  ["mobile_number", "Mobile Number"],
                  ["branch_name", "Branch Name"],
                ] as const
              ).map(([field, label]) => (
                <label key={field}>
                  <span className="text-sm font-bold">{label}</span>
                  <input
                    value={form[field]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"
                  />
                </label>
              ))}

              <label>
                <span className="text-sm font-bold">Instructions</span>
                <textarea
                  value={form.instructions}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      instructions: event.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                />
              </label>

              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black">
                <Save className="h-5 w-5" />
                Save Account
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">Payment Verification</h2>

            <div className="relative mt-5">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search payment, member or reference"
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4"
              />
            </div>

            <div className="mt-5 space-y-4">
              {loading ? (
                <LoaderCircle className="mx-auto h-7 w-7 animate-spin" />
              ) : filteredPayments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                  No payment found.
                </div>
              ) : (
                filteredPayments.map((payment) => (
                  <article
                    key={payment.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-violet-300">
                          {payment.payment_no}
                        </p>
                        <h3 className="mt-2 text-lg font-black">
                          PKR {Number(payment.amount).toLocaleString("en-PK")}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {one(payment.members)?.full_name ?? "Unknown Member"} ·{" "}
                          {one(payment.purchases)?.purchase_code ?? "No purchase"}
                        </p>
                      </div>

                      <span className="self-start rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold capitalize text-amber-300">
                        {payment.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => void openReceipt(payment.receipt_path)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-bold text-violet-200"
                    >
                      <Eye className="h-4 w-4" />
                      View Receipt
                    </button>

                    <textarea
                      value={notes[payment.id] ?? ""}
                      onChange={(event) =>
                        setNotes((current) => ({
                          ...current,
                          [payment.id]: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Admin verification note"
                      className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
                    />

                    {(payment.status === "pending" ||
                      payment.status === "clarification_required") && (
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            void updatePayment(payment, "rejected")
                          }
                          disabled={savingId === payment.id}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-5 font-bold text-rose-300"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void updatePayment(payment, "verified")
                          }
                          disabled={savingId === payment.id}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-black"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Verify Payment
                        </button>
                      </div>
                    )}
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
