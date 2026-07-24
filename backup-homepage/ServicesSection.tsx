import Link from "next/link";
import { ArrowUpRight, Building2, Home, Plane, Refrigerator } from "lucide-react";

const services = [
  { title: "Umrah", description: "Explore approved Umrah packages after registration and KYC.", href: "/services/umrah", icon: Plane, status: "Available" },
  { title: "Family Tours", description: "Planned family travel opportunities through future packages.", href: "/services/family-tours", icon: Home, status: "Coming Soon" },
  { title: "Home Appliances", description: "Access selected home appliance packages through EZ Life.", href: "/services/home-appliances", icon: Refrigerator, status: "Coming Soon" },
  { title: "Property & Homes", description: "Future property and home-related opportunities for members.", href: "/services/property-homes", icon: Building2, status: "Coming Soon" },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#0B1222] py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(109,59,255,0.16),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">Our Services</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">One membership, multiple possibilities.</h2>
          <p className="mt-5 leading-7 text-slate-400">Members register their area of interest first. Available packages can then be viewed and selected from the member portal after approval.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => { const Icon = service.icon; return (
            <Link key={service.title} href={service.href} className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 transition duration-300 hover:-translate-y-2 hover:border-violet-400/40">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-white"><Icon className="h-7 w-7" /></div><span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${service.status === "Available" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-slate-500"}`}>{service.status}</span></div>
                <h3 className="mt-6 text-2xl font-black text-white">{service.title}</h3><p className="mt-3 min-h-24 leading-7 text-slate-400">{service.description}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-violet-300">View Service<ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
              </div>
            </Link>
          ); })}
        </div>
      </div>
    </section>
  );
}
