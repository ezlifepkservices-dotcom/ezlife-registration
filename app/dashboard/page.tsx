import DashboardCards from "../../components/dashboard/DashboardCards";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import MembershipCard from "../../components/dashboard/MembershipCard";
import PaymentCard from "../../components/dashboard/PaymentCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import ReferralCard from "../../components/dashboard/ReferralCard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
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
              EZ Life Member Portal
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
              Everything you need to manage your membership journey.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Track your membership, referrals, installments, balloting status,
              documents and latest activity from one secure dashboard.
            </p>
          </div>
        </section>

        <DashboardCards />

        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <MembershipCard />

          <RecentActivity />
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <ReferralCard />

          <PaymentCard />
        </div>
      </div>
    </DashboardLayout>
  );
}