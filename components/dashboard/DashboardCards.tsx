import {
  CheckCircle2,
  CreditCard,
  Gift,
  UsersRound,
} from "lucide-react";

const cards = [
  {
    title: "Membership",
    value: "Active",
    description: "Your membership is verified.",
    icon: CheckCircle2,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Referrals",
    value: "03 / 05",
    description: "Complete referrals to qualify.",
    icon: UsersRound,
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Installments",
    value: "12 Paid",
    description: "All monthly payments updated.",
    icon: CreditCard,
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Balloting",
    value: "Eligible",
    description: "Eligible for upcoming draw.",
    icon: Gift,
    color: "from-violet-500 to-fuchsia-600",
  },
];

export default function DashboardCards() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-400/30"
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

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {card.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}