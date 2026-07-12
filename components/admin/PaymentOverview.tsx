import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Wallet,
} from "lucide-react";

const payments = [
  {
    member: "Muhammad Ali",
    amount: "PKR 10,000",
    status: "Paid",
  },
  {
    member: "Ahmed Khan",
    amount: "PKR 10,000",
    status: "Pending",
  },
  {
    member: "Sara Malik",
    amount: "PKR 10,000",
    status: "Paid",
  },
  {
    member: "Bilal Ahmed",
    amount: "PKR 10,000",
    status: "Paid",
  },
];

export default function PaymentOverview() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Finance
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Payment Overview
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white">
          <Wallet size={26} />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.member}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172B63] text-white">
                <CreditCard size={18} />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  {payment.member}
                </h3>

                <p className="text-sm text-slate-500">
                  {payment.amount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  payment.status === "Paid"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-orange-500/10 text-orange-300"
                }`}
              >
                {payment.status === "Paid" && (
                  <CheckCircle2
                    size={13}
                    className="mr-1 inline"
                  />
                )}
                {payment.status}
              </span>

              <button className="rounded-xl border border-white/10 p-2 text-slate-300 transition hover:bg-white/5">
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}