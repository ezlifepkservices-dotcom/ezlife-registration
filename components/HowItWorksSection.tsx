import Link from "next/link";
import { UserPlus, CreditCard, Users, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Register",
    description: "Create your EZ Life membership account.",
    icon: UserPlus,
    link: "/register",
  },
  {
    number: "02",
    title: "Membership",
    description: "Learn about the EZ Life membership ecosystem.",
    icon: CreditCard,
    link: "#about",
  },
  {
    number: "03",
    title: "Referral Network",
    description: "Build your referral network and grow together.",
    icon: Users,
    link: "#referral",
  },
  {
    number: "04",
    title: "Balloting",
    description: "Understand the transparent balloting process.",
    icon: Trophy,
    link: "#balloting",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-[#0B1222] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.2em] text-violet-400">
            How It Works
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Start Your Journey
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            Follow these simple steps to become part of the EZ Life ecosystem.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {steps.map((step) => {

            const Icon = step.icon;

            return (

              <Link
                href={step.link}
                key={step.number}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-500"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#6D3BFF] to-[#172B63] text-white">

                    <Icon size={26} />

                  </div>

                  <span className="text-sm font-bold text-violet-300">
                    {step.number}
                  </span>

                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {step.description}
                </p>

                <div className="mt-6 text-sm font-semibold text-violet-300 group-hover:text-white">
                  Learn More →
                </div>

              </Link>

            );

          })}

        </div>

      </div>
    </section>
  );
}