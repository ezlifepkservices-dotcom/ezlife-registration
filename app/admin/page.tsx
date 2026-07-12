import AdminCards from "../../components/admin/AdminCards";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminQuickActions from "../../components/admin/AdminQuickActions";
import LatestRegistrations from "../../components/admin/LatestRegistrations";
import MemberTable from "../../components/admin/MemberTable";
import PaymentOverview from "../../components/admin/PaymentOverview";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#172B63]/70 via-[#111C35] to-[#6D3BFF]/35 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.3)] sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#8C5CFF]/25 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-[#172B63]/70 blur-3xl"
          />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
              EZ Life Admin Panel
            </p>

            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Administration Dashboard
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-slate-300">
              Monitor members, registrations, payments, approvals, overdue
              accounts, balloting and reports from one centralized dashboard.
            </p>
          </div>
        </section>

        <AdminQuickActions />

        <AdminCards />

        <div className="grid gap-8 xl:grid-cols-[1.5fr_0.8fr]">
          <MemberTable />
          <LatestRegistrations />
        </div>

        <PaymentOverview />
      </div>
    </AdminLayout>
  );
}