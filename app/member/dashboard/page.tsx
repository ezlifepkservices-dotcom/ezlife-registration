"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Gift,
  LayoutDashboard,
  LogOut,
  Network,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";

type MemberProfile = {
  full_name: string;
  email: string;
  role: string;
  status: string;
  member_id: string | null;
};

export default function MemberDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadMemberProfile() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          router.replace("/member/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, email, role, status, member_id")
          .eq("auth_user_id", session.user.id)
          .single();

        if (error || !data) {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (data.role !== "member") {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (data.status === "suspended") {
          router.replace("/member/suspended");
          return;
        }

        if (data.status !== "active") {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (isMounted) {
          setProfile(data as MemberProfile);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Member dashboard error:", error);

        if (isMounted) {
          setIsLoading(false);
        }

        toast.error("Member dashboard load nahi ho saka.");
      }
    }

    loadMemberProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await supabase.auth.signOut();
      router.replace("/member/login");
      router.refresh();
    } catch (error) {
      console.error("Member sign out error:", error);
      toast.error("Logout nahi ho saka.");
      setIsSigningOut(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/15 text-indigo-300">
            <UserRound className="h-8 w-8" />
          </div>

          <div className="mx-auto mt-6 h-7 w-7 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />

          <h1 className="mt-5 text-xl font-bold">
            Loading Member Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Please wait while your account is being verified.
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  const firstName = profile.full_name.split(" ")[0] || "Member";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950 p-6 lg:block">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 font-black">
              EZ
            </div>

            <div>
              <p className="font-bold">EZ Life</p>
              <p className="text-xs text-slate-500">Member Portal</p>
            </div>
          </Link>

          <nav className="mt-10 space-y-2">
            <Link
              href="/member/dashboard"
              className="flex items-center gap-3 rounded-2xl bg-indigo-500/15 px-4 py-3 text-sm font-semibold text-indigo-200"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <UserRound className="h-5 w-5" />
              My Profile
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Network className="h-5 w-5" />
              My Referrals
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <CircleDollarSign className="h-5 w-5" />
              Payments
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Gift className="h-5 w-5" />
              Balloting
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <FileText className="h-5 w-5" />
              Documents
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Bell className="h-5 w-5" />
              Notifications
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </nav>

          <div className="mt-10 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-5 w-5" />
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur sm:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Member Dashboard</p>
                <h1 className="text-xl font-bold">
                  Welcome back, {firstName}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:text-white"
                >
                  <Bell className="h-5 w-5" />
                </button>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 p-6 sm:p-8">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  Account Active
                </div>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  Your EZ Life journey starts here.
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                  Track your referrals, payments, balloting eligibility,
                  documents and complete member network from this dashboard.
                </p>
              </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                    <Users className="h-5 w-5" />
                  </div>

                  <span className="text-xs text-slate-500">
                    Direct Members
                  </span>
                </div>

                <p className="mt-5 text-3xl font-black">0</p>
                <p className="mt-1 text-sm text-slate-500">
                  Your direct referrals
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                    <Network className="h-5 w-5" />
                  </div>

                  <span className="text-xs text-slate-500">
                    Total Network
                  </span>
                </div>

                <p className="mt-5 text-3xl font-black">0</p>
                <p className="mt-1 text-sm text-slate-500">
                  All members under you
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                    <CircleDollarSign className="h-5 w-5" />
                  </div>

                  <span className="text-xs text-slate-500">
                    Payment Status
                  </span>
                </div>

                <p className="mt-5 text-2xl font-black">Pending</p>
                <p className="mt-1 text-sm text-slate-500">
                  Payment module coming next
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
                    <Gift className="h-5 w-5" />
                  </div>

                  <span className="text-xs text-slate-500">
                    Balloting
                  </span>
                </div>

                <p className="mt-5 text-2xl font-black">Not Eligible</p>
                <p className="mt-1 text-sm text-slate-500">
                  Eligibility rules pending
                </p>
              </div>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 xl:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      Referral Network
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Your direct and indirect member structure
                    </p>
                  </div>

                  <Network className="h-5 w-5 text-indigo-300" />
                </div>

                <div className="mt-8 rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center">
                  <Users className="mx-auto h-10 w-10 text-slate-600" />

                  <h4 className="mt-4 font-semibold">
                    No referrals available yet
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Your referral code, direct members and complete multi-level
                    network will appear here.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <div>
                  <h3 className="text-lg font-bold">
                    Membership Details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Basic account information
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Full Name
                    </p>

                    <p className="mt-1 font-medium">
                      {profile.full_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Email
                    </p>

                    <p className="mt-1 break-all font-medium">
                      {profile.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Account Status
                    </p>

                    <p className="mt-1 font-medium capitalize text-emerald-300">
                      {profile.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Member ID
                    </p>

                    <p className="mt-1 font-medium">
                      {profile.member_id ?? "Will be generated"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Next Payment
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-slate-400">
                      <CalendarDays className="h-4 w-4" />
                      Payment schedule pending
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}