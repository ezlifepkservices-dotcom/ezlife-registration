import {
  BadgeCheck,
  Eye,
  Headphones,
  Layers3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const items = [
  ["Clear Member Journey", "Every major step is visible from registration to package progress.", Eye],
  ["Verified Accounts", "KYC and profile verification support a safer member ecosystem.", BadgeCheck],
  ["Package-Based Rules", "Payments, referrals and balloting follow the selected package.", Layers3],
  ["Member Support", "Members can raise support tickets and follow responses.", Headphones],
  ["Secure Access", "Member and admin portals use separate protected access.", ShieldCheck],
  ["Community Growth", "Referral progress is tracked through approved member records.", UsersRound],
] as const;

export default function WhyEZLifeSection() {
  return (
    <section id="why-ez-life" className="bg-[#0B1222] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
            Why EZ Life
          </p>
          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            A clearer way to manage your member journey.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map(([title, description, Icon]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-black text-white">{title}</h3>
              <p className="mt-2 leading-7 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
