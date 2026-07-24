import Image from "next/image";
import { Activity, BadgeCheck, PackageCheck, UserPlus } from "lucide-react";

const items = [
  ["Register", "Submit details and select an interest area.", UserPlus],
  ["Verify", "Complete account and KYC verification.", BadgeCheck],
  ["Choose Package", "Select an available service package.", PackageCheck],
  ["Track Progress", "Follow payments and eligibility status.", Activity],
] as const;

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#0F172A] py-14 sm:py-16 lg:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(109,59,255,0.13),transparent_34%)]" />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-8 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400 sm:text-xs">
            How It Works
          </p>

          <h2 className="mt-3 max-w-[520px] text-[clamp(2.25rem,3.8vw,3.55rem)] font-black leading-[1.06] tracking-[-0.038em] text-white">
            A simple process from registration to eligibility.
          </h2>

          <p className="mt-4 max-w-[520px] text-sm leading-7 text-slate-400 sm:text-base">
            The journey moves through registration, verification, package selection, payment and eligibility tracking without unnecessary complexity.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map(([title, description, Icon]) => (
              <article
                key={title}
                className="min-h-[116px] rounded-2xl border border-white/10 bg-white/[0.045] p-4"
              >
                <Icon className="h-5 w-5 text-violet-300" />
                <h3 className="mt-3 text-sm font-black text-white sm:text-base">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px] w-full overflow-hidden rounded-[1.6rem] border border-white/10 sm:min-h-[390px] lg:min-h-[455px]">
          <Image
            src="/photo-how-final.jpg"
            alt="How It Works"
            fill
            sizes="(max-width: 1024px) 100vw, 610px"
            className="scale-[1.08] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/55 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
