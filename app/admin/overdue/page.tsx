import AdminLayout from "../../../components/admin/AdminLayout";
import {
  AlertTriangle,
  CalendarClock,
  CreditCard,
  Phone,
} from "lucide-react";

const overdueMembers = [
  {
    id: "EZ-1021",
    name: "Ahmed Raza",
    phone: "0300-1234567",
    overdueMonths: 2,
    overdueAmount: "PKR 20,000",
    lastPayment: "15 May 2026",
    status: "Overdue",
  },
  {
    id: "EZ-1044",
    name: "Sara Khan",
    phone: "0312-4567890",
    overdueMonths: 1,
    overdueAmount: "PKR 10,000",
    lastPayment: "15 June 2026",
    status: "Overdue",
  },
  {
    id: "EZ-1078",
    name: "Bilal Ahmed",
    phone: "0333-9876543",
    overdueMonths: 3,
    overdueAmount: "PKR 30,000",
    lastPayment: "15 April 2026",
    status: "Critical",
  },
  {
    id: "EZ-1095",
    name: "Usman Ali",
    phone: "0345-1122334",
    overdueMonths: 2,
    overdueAmount: "PKR 20,000",
    lastPayment: "15 May 2026",
    status: "Overdue",
  },
];

export default function OverdueMembersPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-500/15 via-[#111C35] to-[#6D3BFF]/20 p-8">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">
                Payment Monitoring
              </p>

              <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Overdue Members
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                Un members ko monitor karein jinhon ne monthly installments
                rok di hain ya due date ke baad payment submit nahi ki.
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-500/15 text-red-300">
              <AlertTriangle size={36} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-500">Total Overdue</p>
            <p className="mt-3 text-3xl font-black text-white">12</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-500">Overdue Amount</p>
            <p className="mt-3 text-3xl font-black text-red-300">
              PKR 180,000
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-500">Critical Accounts</p>
            <p className="mt-3 text-3xl font-black text-orange-300">03</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-500">Reminders Sent</p>
            <p className="mt-3 text-3xl font-black text-violet-300">08</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
              Installment Recovery
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Overdue Member List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-white/[0.03] text-sm text-slate-500">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Overdue Period</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Last Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {overdueMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-white/5 transition hover:bg-white/[0.025]"
                  >
                    <td className="px-6 py-5">
                      <p className="font-bold text-white">{member.name}</p>

                      <p className="mt-1 text-xs text-violet-300">
                        {member.id}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Phone size={15} />
                        {member.phone}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-300">
                      <span className="inline-flex items-center gap-2">
                        <CalendarClock size={16} />
                        {member.overdueMonths} month(s)
                      </span>
                    </td>

                    <td className="px-6 py-5 font-bold text-red-300">
                      {member.overdueAmount}
                    </td>

                    <td className="px-6 py-5 text-slate-400">
                      {member.lastPayment}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          member.status === "Critical"
                            ? "bg-red-500/15 text-red-300"
                            : "bg-orange-500/15 text-orange-300"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-4 py-2.5 text-sm font-bold text-white"
                      >
                        <CreditCard size={16} />
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}