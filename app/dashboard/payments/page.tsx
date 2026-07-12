import DashboardLayout from "../../../components/dashboard/DashboardLayout";

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-300">
          Payments
        </p>

        <h1 className="mt-3 text-4xl font-black text-white">
          Payment History
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-slate-400">
          Monthly installments, receipts, due dates and payment status will be
          managed here.
        </p>
      </section>
    </DashboardLayout>
  );
}