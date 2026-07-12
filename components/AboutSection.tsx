import Link from "next/link";
import {
  ArrowUpRight,
  Eye,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";

const coreValues = [
  {
    title: "Transparency",
    description:
      "Clear processes, accessible information and responsible communication for every member.",
    icon: ShieldCheck,
  },
  {
    title: "Community",
    description:
      "Building meaningful connections and creating opportunities through collective participation.",
    icon: UsersRound,
  },
  {
    title: "Innovation",
    description:
      "Using technology to make membership services simpler, faster and easier to manage.",
    icon: Lightbulb,
  },
  {
    title: "Trust",
    description:
      "Creating long-term relationships through professional management and member-focused service.",
    icon: HeartHandshake,
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#0F172A] py-24 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-16 h-[430px] w-[430px] rounded-full bg-[#172B63]/45 blur-[135px]" />

        <div className="absolute -right-40 bottom-0 h-[440px] w-[440px] rounded-full bg-[#6D3BFF]/20 blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
              <Sparkles size={14} />
              About EZ Life
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              A connected ecosystem for
              <span className="block bg-gradient-to-r from-violet-200 to-[#8C5CFF] bg-clip-text text-transparent">
                meaningful life opportunities.
              </span>
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              EZ Life is a modern membership platform created to connect
              individuals and families with selected opportunities across
              travel, lifestyle, home appliances and property.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-400">
              Through a structured digital ecosystem, EZ Life aims to make
              registration, membership participation, referrals, balloting and
              service progress easier to understand and manage.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white shadow-[0_14px_40px_rgba(109,59,255,0.3)]">
                  <Target size={27} />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                  Our Mission
                </p>

                <h3 className="mt-3 text-2xl font-black text-white">
                  Make opportunities more accessible
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  To provide a secure, transparent and professionally managed
                  membership ecosystem that helps individuals and families
                  move toward important life goals.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8C5CFF] to-[#172B63] text-white shadow-[0_14px_40px_rgba(109,59,255,0.3)]">
                  <Eye size={27} />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                  Our Vision
                </p>

                <h3 className="mt-3 text-2xl font-black text-white">
                  Build a trusted digital community
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  To become a trusted membership platform that combines
                  technology, community participation and long-term value
                  within one connected experience.
                </p>
              </div>
            </div>

            <div className="mt-9">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.055] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-violet-400/10"
              >
                Discover Our Story
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_35px_100px_rgba(2,6,23,0.4)] backdrop-blur-2xl sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
              Our Core Values
            </p>

            <h3 className="mt-4 text-3xl font-black tracking-tight text-white">
              Principles that guide
              <span className="block text-slate-300">the EZ Life journey.</span>
            </h3>

            <div className="mt-8 grid gap-5">
              {coreValues.map((value) => {
                const Icon = value.icon;

                return (
                  <article
                    key={value.title}
                    className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-white/[0.065]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF]/80 to-[#172B63] text-white">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {value.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {value.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}