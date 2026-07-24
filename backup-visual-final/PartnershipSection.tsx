import Link from "next/link";
import { ArrowRight, Building2, Handshake, ShieldCheck } from "lucide-react";

const items = [
  ["Business Collaboration", "Connect with EZ Life for future service and package partnerships.", Handshake],
  ["Structured Process", "Partnership opportunities follow a clear review and approval process.", Building2],
  ["Professional Standards", "Member trust, service quality and transparency remain central.", ShieldCheck],
] as const;

export default function PartnershipSection() {
  return (
    <section id="partnership" className="bg-[#0B1222] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#172B63]/70 to-[#0F172A] p-7 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-300">
                Partnership
              </p>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
                Build meaningful opportunities together.
              </h2>
              <p className="mt-5 leading-8 text-slate-300">
                EZ Life welcomes future collaboration with service providers and business
                partners who share a commitment to quality, transparency and member value.
              </p>

              <Link
                href="/#contact"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-black text-[#172B63] transition hover:-translate-y-1"
              >
                Contact EZ Life
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {items.map(([title, description, Icon]) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <Icon className="h-6 w-6 text-violet-300" />
                  <h3 className="mt-4 font-black text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
