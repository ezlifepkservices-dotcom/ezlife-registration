"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      toast.error("Email aur password enter karein.");
      return;
    }

    if (!adminEmail) {
      toast.error("Admin email environment variable configure nahi hai.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.user) {
        toast.error("Login complete nahi ho saka.");
        return;
      }

      if (data.user.email?.toLowerCase() !== adminEmail) {
        await supabase.auth.signOut();

        toast.error("Aapko admin panel access ki permission nahi hai.");
        return;
      }

      toast.success("Admin login successful.");

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Login ke dauran unexpected error aa gaya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F172A] px-5 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-[430px] w-[430px] rounded-full bg-[#172B63]/60 blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[#6D3BFF]/25 blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_40px_120px_rgba(2,6,23,0.55)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#172B63] via-[#1A2555] to-[#6D3BFF] p-12 lg:flex lg:flex-col lg:justify-between">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#8C5CFF]/30 blur-3xl"
            />

            <div className="relative">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-black text-white">
                  EZ
                </div>

                <div>
                  <p className="text-xl font-black text-white">EZ Life</p>

                  <p className="text-[10px] uppercase tracking-[0.22em] text-violet-100/70">
                    Empowering Possibilities
                  </p>
                </div>
              </Link>

              <div className="mt-20">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-200">
                  Administration Portal
                </p>

                <h1 className="mt-5 text-4xl font-black leading-tight text-white">
                  Manage registrations and members from one secure dashboard.
                </h1>

                <p className="mt-6 leading-8 text-violet-100/75">
                  Review pending applications, approve members and manage EZ
                  Life operations through one centralized portal.
                </p>
              </div>
            </div>

            <div className="relative mt-12 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    Secure Admin Access
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-violet-100/70">
                    Authentication is securely managed through Supabase.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="lg:hidden">
                <Link href="/" className="inline-flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D3BFF] to-[#172B63] text-base font-black text-white">
                    EZ
                  </div>

                  <div>
                    <p className="text-xl font-black text-white">EZ Life</p>

                    <p className="text-[9px] uppercase tracking-[0.2em] text-violet-300">
                      Admin Portal
                    </p>
                  </div>
                </Link>
              </div>

              <div className="mt-10 lg:mt-0">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-400">
                  Admin Login
                </p>

                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  Sign in to continue
                </h2>

                <p className="mt-4 leading-7 text-slate-400">
                  Enter your authorized admin email and password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    Admin Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="ezlifepkservices@gmail.com"
                      autoComplete="email"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-12 pr-14 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] text-base font-bold text-white shadow-[0_16px_45px_rgba(109,59,255,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(109,59,255,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <LoaderCircle size={20} className="animate-spin" />
                  )}

                  {isSubmitting ? "Signing In..." : "Sign In as Admin"}
                </button>
              </form>

              <Link
                href="/"
                className="mt-8 block text-center text-sm font-semibold text-slate-500 transition hover:text-white"
              >
                Return to homepage
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}