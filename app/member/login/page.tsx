"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";

type MemberProfile = {
  role: "super_admin" | "admin" | "staff" | "member";
  status: "active" | "pending" | "suspended" | "blocked";
  must_change_password: boolean;
};

export default function MemberLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

      if (loginError || !loginData.user) {
        toast.error("Email ya password theek nahi hai.");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, status, must_change_password")
        .eq("auth_user_id", loginData.user.id)
        .single();

      if (profileError || !profileData) {
        await supabase.auth.signOut();
        toast.error("Aapka member profile system mein nahi mila.");
        return;
      }

      const profile = profileData as MemberProfile;

      if (profile.role !== "member") {
        await supabase.auth.signOut();
        toast.error("Ye login sirf EZ Life members ke liye hai.");
        return;
      }

      if (profile.status === "suspended") {
        router.replace("/member/suspended");
        return;
      }

      if (profile.status === "blocked") {
        await supabase.auth.signOut();
        toast.error("Aapka member account blocked hai.");
        return;
      }

      if (profile.status !== "active") {
        await supabase.auth.signOut();
        toast.error("Aapka member account abhi active nahi hai.");
        return;
      }

      if (profile.must_change_password) {
        router.replace("/member/change-password");
        return;
      }

      toast.success("Member login successful.");
      router.replace("/member/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Member login error:", error);
      toast.error("Login ke dauran unexpected error aa gaya.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-32 top-20 hidden h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl sm:block" />
          <div className="absolute -bottom-32 right-0 hidden h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl sm:block" />

          <Link href="/" className="relative z-10 inline-flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <Image
                src="/ezlife-logo.png"
                alt="EZ Life logo"
                fill
                priority
                sizes="80px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-2xl font-bold">EZ Life</p>
              <p className="text-sm text-slate-400">
                Empowering Possibilities
              </p>
            </div>
          </Link>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
              <UserRound className="h-4 w-4" />
              Member Portal
            </div>

            <h1 className="text-4xl font-black leading-tight xl:text-5xl">
              Manage your EZ Life membership from one place.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              View your profile, referral network, payments, balloting,
              documents and account notifications.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold">Referrals</p>
              <p className="mt-1 text-xs text-slate-400">
                View your complete network.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold">Payments</p>
              <p className="mt-1 text-xs text-slate-400">
                Track monthly installments.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold">Balloting</p>
              <p className="mt-1 text-xs text-slate-400">
                Check your eligibility.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-4 lg:hidden">
              <div className="relative h-20 w-20 shrink-0">
                <Image
                  src="/ezlife-logo.png"
                  alt="EZ Life logo"
                  fill
                  priority
                  sizes="80px"
                  className="object-contain"
                />
              </div>

              <div>
                <p className="text-lg font-bold">EZ Life</p>
                <p className="text-xs text-slate-500">Member Portal</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8">
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                  <UserRound className="h-7 w-7" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                  Member Login
                </p>

                <h2 className="mt-3 text-3xl font-black">Welcome back</h2>

                <p className="mt-3 leading-7 text-slate-400">
                  Enter the email and password provided after membership
                  approval.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Member Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your registered email"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-12 pr-4 outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
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
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-12 pr-14 outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={isSubmitting}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
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
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold shadow-lg shadow-indigo-950/50 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}

                  {isSubmitting ? "Signing In..." : "Sign In as Member"}
                </button>
              </form>

              <div className="mt-7 space-y-4 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Membership not approved yet?
                </p>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200"
                >
                  Submit Registration
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div>
                  <Link
                    href="/"
                    className="text-sm text-slate-500 hover:text-white"
                  >
                    Return to homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
