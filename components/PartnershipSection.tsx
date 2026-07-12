import {
  Building2,
  Handshake,
  Home,
  Plane,
  ShieldCheck,
  Sofa,
} from "lucide-react";

const partners = [
  {
    title: "Travel Partners",
    description: "Umrah & Family Tour Providers",
    icon: Plane,
  },
  {
    title: "Home Appliances",
    description: "Trusted Electronics Partners",
    icon: Sofa,
  },
  {
    title: "Property Partners",
    description: "Real Estate Opportunities",
    icon: Home,
  },
  {
    title: "Financial Support",
    description: "Future Financial Ecosystem",
    icon: Building2,
  },
];

export default function PartnershipSection() {
  return (
    <section
      id="partners"
      className="bg-[#0B1222] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.2em] text-violet-400">
            Partnership Ecosystem
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Strong Partnerships.
            <span className="block text-violet-300">
              Better Opportunities.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-slate-400 leading-8">
            EZ Life collaborates with trusted organizations to provide
            members with valuable services and long-term opportunities.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {partners.map((partner) => {

            const Icon = partner.icon;

            return (

              <div
                key={partner.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:-translate-y-2 hover:border-violet-500"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#6D3BFF] to-[#172B63] text-white">
                  <Icon size={30} />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {partner.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {partner.description}
                </p>

              </div>

            );

          })}

        </div>

        <div className="mt-16 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-[#172B63]/60 to-[#6D3BFF]/40 p-10 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-white">
            <Handshake size={40} />
          </div>

          <h3 className="mt-8 text-3xl font-black text-white">
            Growing Together
          </h3>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-200">
            Our partnership ecosystem is continuously expanding to provide
            more value, better services and stronger opportunities for every
            EZ Life member.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white">

            <ShieldCheck size={18} />

            Trusted & Verified Partners

          </div>

        </div>

      </div>
    </section>
  );
}