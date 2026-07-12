import {
  CheckCircle2,
  CreditCard,
  Gift,
  UserPlus,
} from "lucide-react";

const activities = [
  {
    title: "Monthly installment received",
    time: "Today • 10:15 AM",
    icon: CreditCard,
    color: "bg-emerald-500",
  },
  {
    title: "New referral joined successfully",
    time: "Yesterday • 04:30 PM",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    title: "Balloting eligibility updated",
    time: "2 days ago",
    icon: Gift,
    color: "bg-violet-500",
  },
  {
    title: "Membership verified",
    time: "5 days ago",
    icon: CheckCircle2,
    color: "bg-green-500",
  },
];

export default function RecentActivity() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Timeline
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Recent Activity
          </h2>
        </div>

        <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold text-violet-300">
          Latest Updates
        </span>
      </div>

      <div className="mt-8 space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-violet-400/30"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${activity.color} text-white`}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-white">
                  {activity.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}