import {
  ArrowRight,
  Gift,
  Network,
  Share2,
  UserPlus,
  UsersRound,
} from "lucide-react";

const referralSteps = [
  {
    number: "01",
    title: "Get Your Referral Code",
    description:
      "Every approved EZ Life member receives a unique referral code linked with their profile.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Invite Your Network",
    description:
      "Share your referral code with family, friends and people interested in EZ Life services.",
    icon: Share2,
  },
  {
    number: "03",
    title: "Build Your Community",
    description:
      "Track the members joining through your referral network and follow your progress.",
    icon: Network,
  },
  {
    number: "04",
    title: "Unlock Opportunities",
    description:
      "Active participation can connect members with future benefits and available opportunities.",
    icon: Gift,
  },
];

export default function ReferralProgramSection() {
  return (
    <section
      id="referral"
      className="relative overflow-hidden bg-[#0F172A] py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#6D3BFF]/15 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#172B63]/45 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-[0.2em] text-violet-400">
              Referral Program
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              Grow Together Through
              <span className="block bg-gradient-to-r from-violet-200 to-[#8C5CFF] bg-clip-text text-transparent">
                Meaningful Connections
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
              The EZ Life referral program is designed to help members grow
              their community through a simple, transparent and trackable
              process.
            </p>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white">
                  <UsersRound size={27} />
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-violet-300">
                    Your Network
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-white">
                    Every connection matters
                  </h3>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm text-slate-400">Unique Referral Code</p>
                  <p className="mt-2 text-xl font-black text-white">
                    Member Specific
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm text-slate-400">Progress Tracking</p>
                  <p className="mt-2 text-xl font-black text-white">
                    Dashboard Based
                  </p>
                </div>
              </div>

              <a
                href="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1"
              >
                Join the Network
                <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <div className="grid gap-5">
            {referralSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group flex gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.07]"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white">
                    <Icon size={25} />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black tracking-[0.18em] text-violet-300">
                        {step.number}
                      </span>

                      <h3 className="text-xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>

                    <p className="mt-3 leading-7 text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}