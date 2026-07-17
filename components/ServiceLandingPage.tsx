"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BellRing,
  Gift,
  Home,
  Plane,
  Sparkles,
  Users,
} from "lucide-react";

type ServiceType =
  | "umrah"
  | "family-tours"
  | "home-appliances"
  | "property-homes";

type Props = {
  service: ServiceType;
};

const serviceData = {
  umrah: {
    title: "Umrah",
    subtitle: "Begin Your Spiritual Journey",
    description:
      "EZ Life Umrah membership registration is currently available. Complete your registration and proceed through the secure verification process.",
    background:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=2000&q=85",
    icon: Plane,
    available: true,
  },
  "family-tours": {
    title: "Family Tours",
    subtitle: "Memorable Journeys Are Coming",
    description:
      "We are preparing carefully planned family travel experiences designed for comfort, connection and unforgettable memories.",
    background:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85",
    icon: Users,
    available: false,
  },
  "home-appliances": {
    title: "Home Appliances",
    subtitle: "Smarter Living Is Coming",
    description:
      "A convenient range of household appliances and easy membership-based purchase options is being prepared for EZ Life members.",
    background:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=2000&q=85",
    icon: Gift,
    available: false,
  },
  "property-homes": {
    title: "Property / Homes",
    subtitle: "Your Future Home Is Coming",
    description:
      "We are developing trusted property and home opportunities designed to make long-term goals more accessible.",
    background:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    icon: Home,
    available: false,
  },
} as const;

export default function ServiceLandingPage({ service }: Props) {
  const item = serviceData[service];
  const Icon = item.icon;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0F172A] px-5 py-20 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-out hover:scale-105"
        style={{ backgroundImage: `url("${item.background}")` }}
      />

      {/* 70% dark overlay = background photo remains 30% visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#070D20]/70"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#172B63]/45 via-transparent to-[#6D3BFF]/30"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px]"
      />

      <section className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/15 bg-[#111C35]/70 p-7 text-center shadow-[0_35px_120px_rgba(2,6,23,0.65)] backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-300/25 bg-gradient-to-br from-[#6D3BFF]/80 to-[#172B63]/90 text-white shadow-[0_0_45px_rgba(109,59,255,0.35)]">
          <Icon size={36} />
        </div>

        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
          {item.available ? (
            <>
              <Sparkles size={14} />
              Available Now
            </>
          ) : (
            <>
              <BellRing size={14} />
              Coming Soon
            </>
          )}
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
          {item.title}
        </h1>

        <p className="mt-4 text-xl font-bold text-violet-200">
          {item.subtitle}
        </p>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          {item.description}
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          {item.available && (
            <Link
              href="/register"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-7 py-3.5 font-bold text-white shadow-[0_16px_45px_rgba(109,59,255,0.35)] transition hover:-translate-y-1"
            >
              Register for Umrah
              <ArrowUpRight size={18} />
            </Link>
          )}

          <Link
            href="/"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
