import {
  Bell,
  FileCheck2,
  Gift,
  Plus,
  Settings,
  UsersRound,
} from "lucide-react";

const actions = [
  {
    title: "Add Member",
    icon: Plus,
  },
  {
    title: "Approve Registration",
    icon: FileCheck2,
  },
  {
    title: "Start Balloting",
    icon: Gift,
  },
  {
    title: "Manage Services",
    icon: Settings,
  },
  {
    title: "Send Notification",
    icon: Bell,
  },
  {
    title: "Members",
    icon: UsersRound,
  },
];

export default function AdminQuickActions() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
          Quick Actions
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Frequently Used Actions
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white">
                <Icon size={22} />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  {action.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Open Module
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}