import {
  CreditCard,
  TrendingUp,
  UserCheck,
  UsersRound,
  Wallet,
  Gift,
} from "lucide-react";

const cards = [
  {
    title: "Total Members",
    value: "1,284",
    subtitle: "+28 this month",
    icon: UsersRound,
    color: "from-violet-500 to-indigo-600",
  },
  {
    title: "Pending Approvals",
    value: "18",
    subtitle: "Require verification",
    icon: UserCheck,
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Monthly Collection",
    value: "PKR 12.8M",
    subtitle: "Current month",
    icon: Wallet,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Payments",
    value: "97%",
    subtitle: "Collection rate",
    icon: CreditCard,
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Upcoming Balloting",
    value: "145",
    subtitle: "Eligible Members",
    icon: Gift,
    color: "from-pink-500 to-fuchsia-600",
  },
  {
    title: "Growth Rate",
    value: "+14%",
    subtitle: "Compared to last month",
    icon: TrendingUp,
    color: "from-sky-500 to-indigo-500",
  },
];

export default function AdminCards() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-400/30"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.color} text-white shadow-lg`}
            >
              <Icon size={26} />
            </div>

            <p className="mt-6 text-sm uppercase tracking-[0.18em] text-slate-500">
              {card.title}
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              {card.value}
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </section>
  );
}