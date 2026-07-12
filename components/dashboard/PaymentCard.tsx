import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
} from "lucide-react";

const payments = [
  {
    month: "July 2026",
    amount: "PKR 10,000",
    status: "Paid",
  },
  {
    month: "June 2026",
    amount: "PKR 10,000",
    status: "Paid",
  },
  {
    month: "May 2026",
    amount: "PKR 10,000",
    status: "Paid",
  },
];

export default function PaymentCard() {
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
              <CreditCard size={27} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                Payment History
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Monthly Installments
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                View your payment history and upcoming installment schedule.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
            <CheckCircle2 size={16} />
            Up to Date
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-sm text-slate-500">Total Paid</p>

            <h3 className="mt-2 text-2xl font-black text-white">
              PKR 120,000
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-sm text-slate-500">Next Due</p>

            <h3 className="mt-2 text-2xl font-black text-white">
              PKR 10,000
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarDays size={17} />
              <span className="text-sm">Due Date</span>
            </div>

            <h3 className="mt-2 text-2xl font-black text-white">
              15 Aug 2026
            </h3>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">
              Recent Payments
            </h3>

            <Link
              href="/dashboard/payments"
              className="inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition hover:text-white"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            {payments.map((payment) => (
              <div
                key={payment.month}
                className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4 last:border-b-0"
              >
                <div>
                  <p className="font-bold text-white">
                    {payment.month}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {payment.amount}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    {payment.status}
                  </span>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <Download size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard/payments"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-6 text-sm font-bold text-white transition hover:-translate-y-1"
          >
            Make Payment
          </Link>
        </div>
      </div>
    </section>
  );
}