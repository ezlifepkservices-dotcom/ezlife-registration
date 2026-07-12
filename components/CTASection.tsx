import Link from "next/link";

const benefits = [
  "Simple registration process",
  "Multiple lifestyle services",
  "Referral and balloting journey",
];

export default function CTASection() {
  return (
    <section
      id="membership"
      className="relative overflow-hidden bg-[#0F172A] py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[900px] -translate-x-1/2 rounded-[100%] bg-[#6D3BFF]/20 blur-[160px]" />
        <div className="absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-[#172B63]/50 blur-[140px]" />
        <div className="absolute -bottom-48 -right-32 h-[420px] w-[420px] rounded-full bg-[#8C5CFF]/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] px-6 py-14 shadow-[0_40px_120px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:px-10 lg:px-16 lg:py-16">
          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex rounded-full border border-violet-300/15 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                Become a Member
              </div>

              <h2 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Start your journey with
                <span className="block bg-gradient-to-r from-violet-200 to-[#8C5CFF] bg-clip-text text-transparent">
                  EZ Life today.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Join a growing membership ecosystem connecting people with
                travel, lifestyle, home appliance and property opportunities.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-400/20 text-xs font-bold text-violet-200">
                      ✓
                    </span>

                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex min-w-[240px] flex-col gap-4">
              <Link
                href="/register"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-8 text-base font-bold text-white shadow-[0_18px_55px_rgba(109,59,255,0.38)] transition-all duration-300 hover:-translate-y-1"
              >
                Register Now →
              </Link>

              <Link
                href="#services"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.055] px-8 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}