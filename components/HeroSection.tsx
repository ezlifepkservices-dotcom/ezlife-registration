import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Gift,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const benefits = [
  "Structured membership journey",
  "Multiple lifestyle services",
  "Transparent member progress",
];

const serviceItems = [
  {
    title: "Umrah",
    icon: Plane,
    position: "left-[1%] top-[14%]",
  },
  {
    title: "Family Tours",
    icon: Users,
    position: "right-[0%] top-[10%]",
  },
  {
    title: "Appliances",
    icon: Gift,
    position: "left-[0%] bottom-[13%]",
  },
  {
    title: "Property",
    icon: ShieldCheck,
    position: "right-[0%] bottom-[15%]",
  },
];

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#0F172A] pb-20 pt-32 sm:pt-36 lg:flex lg:items-center lg:pb-16 lg:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="hero-orb absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-[#172B63]/60 blur-[120px]" />
        <div className="hero-orb-delayed absolute -right-36 top-0 h-[460px] w-[460px] rounded-full bg-[#6D3BFF]/30 blur-[130px]" />
        <div className="absolute bottom-[-220px] left-1/2 h-[460px] w-[850px] -translate-x-1/2 rounded-[100%] bg-[#6D3BFF]/15 blur-[150px]" />
        <div className="absolute left-1/2 top-[18%] h-px w-[90%] max-w-6xl -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-5 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="hero-fade-up inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 backdrop-blur-xl sm:text-sm">
            <Sparkles size={15} />
            A smarter path to better living
          </div>

          <h1 className="hero-fade-up hero-delay-1 mt-7 text-4xl font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-[68px]">
            Life&apos;s goals become
            <span className="block bg-gradient-to-r from-white via-violet-200 to-[#8C5CFF] bg-clip-text text-transparent">
              easier with EZ Life.
            </span>
          </h1>

          <p className="hero-fade-up hero-delay-2 mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            A premium membership ecosystem designed to connect individuals and
            families with meaningful opportunities across travel, lifestyle,
            home solutions and property.
          </p>

          <div className="hero-fade-up hero-delay-3 mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-7 text-base font-bold text-white shadow-[0_18px_55px_rgba(109,59,255,0.38)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_65px_rgba(109,59,255,0.52)]"
            >
              Become a Member
              <ArrowUpRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              href="#how-it-works"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-7 text-base font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/10"
            >
              Explore How It Works
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="hero-fade-up hero-delay-4 mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-400/15 text-violet-300">
                  <Check size={13} strokeWidth={3} />
                </span>
                {benefit}
              </div>
            ))}
          </div>

          <div className="hero-fade-up hero-delay-5 mt-10 flex items-center gap-5">
            <div className="flex -space-x-3">
              {["EZ", "UM", "FT", "HP"].map((text, index) => (
                <div
                  key={text}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0F172A] bg-gradient-to-br from-[#172B63] to-[#6D3BFF] text-[10px] font-bold text-white shadow-lg"
                  style={{ zIndex: 4 - index }}
                >
                  {text}
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center gap-1 text-sm font-bold text-white">
                Growing Community
                <span className="text-violet-300">+</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                Building opportunities together
              </p>
            </div>
          </div>
        </div>

        <div className="hero-fade-in hero-delay-2 relative mx-auto w-full max-w-[720px]">
          <div className="relative aspect-square">
            <div className="absolute inset-[2%] animate-[spin_28s_linear_infinite] rounded-full border border-dashed border-violet-300/20" />
            <div className="absolute inset-[9%] animate-[spin_22s_linear_infinite_reverse] rounded-full border border-white/10" />
            <div className="absolute inset-[7%] rounded-full bg-gradient-to-br from-[#6D3BFF]/30 via-[#172B63]/40 to-transparent blur-3xl" />

            <div className="hero-float absolute inset-[5%] flex items-center justify-center">
              <div className="relative h-full w-full">
                <Image
                  src="/ezlife-logo.png"
                  alt="EZ Life"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 700px"
                  className="object-contain drop-shadow-[0_0_35px_rgba(56,189,248,0.42)]"
                />
              </div>
            </div>

            {serviceItems.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className={`hero-service-card absolute ${service.position} z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#111C35]/80 px-4 py-3 shadow-[0_20px_50px_rgba(2,6,23,0.45)] backdrop-blur-xl`}
                  style={{
                    animationDelay: `${index * 0.6}s`,
                  }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white shadow-lg">
                    <Icon size={19} />
                  </span>

                  <div>
                    <p className="text-xs text-slate-400">EZ Life</p>
                    <p className="text-sm font-bold text-white">
                      {service.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-500 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em]">
          Discover More
        </span>
        <div className="flex h-9 w-6 justify-center rounded-full border border-white/15 pt-2">
          <span className="hero-scroll-dot h-1.5 w-1.5 rounded-full bg-violet-300" />
        </div>
      </div>
    </section>
  );
}
