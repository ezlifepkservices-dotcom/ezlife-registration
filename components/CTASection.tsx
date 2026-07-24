import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CTASection() {
  return (
    <section className="ez-section relative overflow-hidden bg-[#0F172A]">
      <div className="ez-container relative">
        <div className="ez-grid-2 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#172B63]/90 to-[#6D3BFF]/60 p-7 sm:p-10 lg:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-200">Ready to Begin?</p>
            <h2 className="ez-heading-lg mt-4 font-black text-white">Register your interest and start your EZ Life journey.</h2>

            <div className="mt-6 space-y-3">
              {["Simple digital registration","Member dashboard progress tracking","Package-based purchase and payment flow"].map((item)=>(
                <div key={item} className="flex items-center gap-2 text-violet-100">
                  <CheckCircle2 className="h-4 w-4" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-7 font-black text-[#172B63]">
                Register Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 font-bold text-white">
                Member Login
              </Link>
            </div>
          </div>

          <div className="ez-media-frame">
            <Image src="/visual-cta.png" alt="EZ Life family opportunity" fill sizes="(max-width:1024px) 100vw,550px" className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
