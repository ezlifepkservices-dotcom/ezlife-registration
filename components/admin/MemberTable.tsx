import { Eye, Pencil, Trash2 } from "lucide-react";

const members = [
  {
    id: "EZ-1001",
    name: "Muhammad Ali",
    city: "Karachi",
    status: "Active",
  },
  {
    id: "EZ-1002",
    name: "Ahmed Khan",
    city: "Lahore",
    status: "Pending",
  },
  {
    id: "EZ-1003",
    name: "Usman Tariq",
    city: "Islamabad",
    status: "Active",
  },
  {
    id: "EZ-1004",
    name: "Bilal Ahmed",
    city: "Hyderabad",
    status: "Active",
  },
  {
    id: "EZ-1005",
    name: "Sara Malik",
    city: "Karachi",
    status: "Pending",
  },
];

export default function MemberTable() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Members
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Latest Members
          </h2>
        </div>

        <button className="rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-5 py-3 text-sm font-bold text-white">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm text-slate-400">
              <th className="pb-4">Member ID</th>
              <th className="pb-4">Name</th>
              <th className="pb-4">City</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-white/5 transition hover:bg-white/[0.03]"
              >
                <td className="py-5 font-bold text-violet-300">
                  {member.id}
                </td>

                <td className="py-5 font-semibold text-white">
                  {member.name}
                </td>

                <td className="py-5 text-slate-400">
                  {member.city}
                </td>

                <td className="py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      member.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-orange-500/10 text-orange-300"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="py-5">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5">
                      <Eye size={16} />
                    </button>

                    <button className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5">
                      <Pencil size={16} />
                    </button>

                    <button className="rounded-lg border border-red-500/20 p-2 text-red-300 hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}