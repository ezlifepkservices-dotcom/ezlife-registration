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
import { supabase } from "../../../lib/supabase";

type AdminProfile = {
  role: "super_admin" | "admin" | "staff" | "member";
  status: "active" | "pending" | "suspended" | "blocked";
};

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      toast.error("Email aur password enter karein.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (loginError) {
        toast.error(loginError.message);
        return;
      }

      const user = loginData.user;

      if (!user) {
        toast.error("Login complete nahi ho saka.");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError || !profileData) {
        await supabase.auth.signOut();
        toast.error("Aapka admin profile system mein nahi mila.");
        return;
      }

      const profile = profileData as AdminProfile;

      if (profile.role !== "admin" && profile.role !== "super_admin") {
        await supabase.auth.signOut();
        toast.error("Aapko admin panel access ki permission nahi hai.");
        return;
      }

      if (profile.status !== "active") {
        await supabase.auth.signOut();

        if (profile.status === "suspended") {
          toast.error("Aapka admin account suspended hai.");
        } else if (profile.status === "blocked") {
          toast.error("Aapka admin account blocked hai.");
        } else {
          toast.error("Aapka admin account abhi active nahi hai.");
        }

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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-violet-950 via-slate-950 to-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-32 top-20 hidden h-96 w-96 rounded-full bg-violet-600/20 blur-3xl sm:block" />
          <div className="absolute -bottom-32 right-0 hidden h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl sm:block" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-black shadow-lg shadow-violet-950/50">
                EZ
              </div>

              <div>
                <p className="text-xl font-bold">EZ Life</p>
                <p className="text-sm text-slate-400">
                  Empowering Possibilities
                </p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
              <ShieldCheck className="h-4 w-4" />
              Administration Portal
            </div>

            <h1 className="text-4xl font-black leading-tight xl:text-5xl">
              Manage registrations and members from one secure dashboard.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Review pending applications, approve members and manage EZ Life
              operations through one centralized portal.
            </p>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Secure Admin Access</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Authentication and role verification are securely managed
                  through Supabase.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 font-black">
                EZ
              </div>

              <div>
                <p className="font-bold">EZ Life</p>
                <p className="text-xs text-slate-500">Admin Portal</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:backdrop-blur sm:p-8">
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
                  Admin Login
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Sign in to continue
                </h2>

                <p className="mt-3 leading-7 text-slate-400">
                  Enter your authorized admin email and password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Admin Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="ezlifepkservices@gmail.com"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-12 pr-14 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((currentValue) => !currentValue)
                      }
                      disabled={isSubmitting}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white disabled:cursor-not-allowed"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-lg shadow-violet-950/50 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSubmitting && (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  )}

                  {isSubmitting ? "Signing In..." : "Sign In as Admin"}
                </button>
              </form>

              <div className="mt-7 border-t border-white/10 pt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Return to homepage
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
