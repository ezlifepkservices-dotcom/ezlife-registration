import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-[#08101F]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-lg font-black text-white">
                EZ
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">EZ Life</h2>

                <p className="text-[10px] uppercase tracking-[0.22em] text-violet-300">
                  Empowering Possibilities
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm leading-7 text-slate-400">
              A modern membership ecosystem connecting individuals and
              families with meaningful lifestyle opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Quick Links</h3>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/"
                className="text-slate-400 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="#about"
                className="text-slate-400 transition hover:text-white"
              >
                About
              </Link>

              <Link
                href="#services"
                className="text-slate-400 transition hover:text-white"
              >
                Services
              </Link>

              <Link
                href="#how-it-works"
                className="text-slate-400 transition hover:text-white"
              >
                How It Works
              </Link>

              <Link
                href="/register"
                className="text-slate-400 transition hover:text-white"
              >
                Registration
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Contact</h3>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3 text-slate-400">
                <Phone size={18} className="mt-1 shrink-0 text-violet-300" />
                <span>+92 XXX XXXXXXX</span>
              </div>

              <div className="flex items-start gap-3 text-slate-400">
                <Mail size={18} className="mt-1 shrink-0 text-violet-300" />
                <span>info@ezlife.pk</span>
              </div>

              <div className="flex items-start gap-3 text-slate-400">
                <MapPin size={18} className="mt-1 shrink-0 text-violet-300" />
                <span>Karachi, Pakistan</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Follow Us</h3>

            <p className="mt-6 leading-7 text-slate-400">
              Follow EZ Life for future updates, announcements and membership
              opportunities.
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition duration-300 hover:-translate-y-1 hover:border-[#1877F2]/50 hover:bg-[#1877F2]"
              >
                <FaFacebookF size={19} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition duration-300 hover:-translate-y-1 hover:border-[#E4405F]/50 hover:bg-[#E4405F]"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition duration-300 hover:-translate-y-1 hover:border-[#0077B5]/50 hover:bg-[#0077B5]"
              >
                <FaLinkedinIn size={19} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 EZ Life. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="#" className="transition hover:text-white">
              Privacy Policy
            </Link>

            <Link href="#" className="transition hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}