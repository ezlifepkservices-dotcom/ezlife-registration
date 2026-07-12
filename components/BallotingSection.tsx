import {
  BadgeCheck,
  ClipboardCheck,
  CreditCard,
  Gift,
  Trophy,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Registration",
    description: "Complete your EZ Life membership registration.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Verification",
    description: "Your profile and submitted documents are verified.",
    icon: BadgeCheck,
  },
  {
    number: "03",
    title: "Monthly Installments",
    description: "Stay active by maintaining your monthly contributions.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Balloting",
    description: "Eligible members become part of the transparent balloting process.",
    icon: ClipboardCheck,
  },
  {
    number: "05",
    title: "Winner Announcement",
    description: "Selected members are announced according to the official process.",
    icon: Trophy,
  },
  {
    number: "06",
    title: "Service Delivery",
    description: "The selected member proceeds towards the chosen service.",
    icon: Gift,
  },
];

export default function BallotingSection() {
  return (
    <section
      id="balloting"
      className="bg-[#0B1222] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.2em] text-violet-400">
            Balloting Process
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Transparent Selection Journey
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-slate-400">
            Every member follows the same structured process from registration
            to the final service allocation.
          </p>

        </div>

        <div className="relative mt-20">

          <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 bg-gradient-to-b from-[#6D3BFF] to-[#172B63] lg:block"></div>

          <div className="grid gap-10">

            {steps.map((step) => {

              const Icon = step.icon;

              return (

                <div
                  key={step.number}
                  className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:w-[48%] odd:mr-auto even:ml-auto"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#6D3BFF] to-[#172B63] text-white">
                      <Icon size={25} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-violet-300">
                        STEP {step.number}
                      </p>

                      <h3 className="text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>

                  </div>

                  <p className="mt-6 leading-7 text-slate-400">
                    {step.description}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </div>
    </section>
  );
}