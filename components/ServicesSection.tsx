import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Home,
  Laptop,
  Plane,
  Refrigerator,
  Sparkles,
} from "lucide-react";

const services = [
  ["Umrah","Approved Umrah packages after registration and KYC.","/services/umrah",Plane,"Available"],
  ["Family Tours","Future family travel opportunities through active packages.","/services/family-tours",Home,"Coming Soon"],
  ["Home Appliances","Selected appliance packages for approved members.","/services/home-appliances",Refrigerator,"Coming Soon"],
  ["Property & Homes","Future property and home-related opportunities.","/services/property-homes",Building2,"Coming Soon"],
  ["Electronics","Future laptop, mobile and smart-device packages.","/services/home-appliances",Laptop,"Coming Soon"],
  ["Future Services","More member-focused opportunities will be added.","/register",Sparkles,"Future"],
] as const;

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#0F172A] py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(109,59,255,0.15),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
            Our Services
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Solutions that make life easier.
          </h2>
          <p className="mt-5 leading-7 text-slate-400">
            Members register their interest first. Available packages become
            visible in the member portal after approval.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map(([title,description,href,Icon,status]) => (
            <Link
              key={title}
              href={href}
              className="group rounded-[1.65rem] border border-white/10 bg-[#111C35]/85 p-6 backdrop-blur transition hover:-translate-y-2 hover:border-violet-400/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {status}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-white">{title}</h3>
              <p className="mt-3 min-h-20 leading-7 text-slate-400">{description}</p>

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-violet-300">
                View Service
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
