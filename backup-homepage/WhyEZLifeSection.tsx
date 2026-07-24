import {
  BadgeCheck,
  Eye,
  Handshake,
  Layers3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const features = [
  {
    title: "Transparent Process",
    description:
      "Members can clearly understand their registration, services and participation journey.",
    icon: Eye,
  },
  {
    title: "Multiple Services",
    description:
      "Travel, appliances, property and lifestyle opportunities are available through one ecosystem.",
    icon: Layers3,
  },
  {
    title: "Community Focused",
    description:
      "EZ Life is designed around collaboration, participation and community growth.",
    icon: UsersRound,
  },
  {
    title: "Professional Management",
    description:
      "A structured system helps manage registrations, approvals, payments and member records.",
    icon: BadgeCheck,
  },
  {
    title: "Secure Platform",
    description:
      "Member information and future digital processes will be managed through secure technology.",
    icon: ShieldCheck,
  },
  {
    title: "Partnership Network",
    description:
      "A growing partnership ecosystem will connect members with valuable services and opportunities.",
    icon: Handshake,
  },
];

export default function WhyEZLifeSection() {
  return (
    <section
      id="why-ez-life"
      className="relative overflow-hidden bg-[#0F172A] py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#172B63]/40 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#6D3BFF]/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-[0.2em] text-violet-400">
            Why EZ Life
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            Designed for a Smarter
            <span className="block bg-gradient-to-r from-violet-200 to-[#8C5CFF] bg-clip-text text-transparent">
              Membership Experience
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            EZ Life combines technology, services and community participation
            in one professionally managed platform.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-400/30 hover:bg-white/[0.07]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white shadow-lg">
                  <Icon size={26} />
                </div>

                <h3 className="mt-7 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}