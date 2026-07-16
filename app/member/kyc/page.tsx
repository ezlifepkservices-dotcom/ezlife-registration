"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import KYCForm from "@/components/member/kyc/KYCForm";
import { supabase } from "@/lib/supabase";

type MemberContext = {
  authUserId: string;
  memberId: string;
  fullName: string;
  email: string;
};

export default function MemberKycPage() {
  const router = useRouter();

  const [member, setMember] = useState<MemberContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMember() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          router.replace("/member/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "member_id, full_name, email, role, status, must_change_password",
          )
          .eq("auth_user_id", session.user.id)
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (profile.role !== "member") {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (profile.status === "suspended") {
          router.replace("/member/suspended");
          return;
        }

        if (profile.status !== "active" || !profile.member_id) {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (profile.must_change_password) {
          router.replace("/member/change-password");
          return;
        }

        if (isMounted) {
          setMember({
            authUserId: session.user.id,
            memberId: profile.member_id,
            fullName: profile.full_name,
            email: profile.email,
          });

          setIsLoading(false);
        }
      } catch (error) {
        console.error("KYC page load error:", error);

        if (isMounted) {
          setIsLoading(false);
        }

        toast.error("KYC page load nahi ho saka.");
      }
    }

    void loadMember();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />

          <p className="mt-4 text-slate-400">
            Loading KYC...
          </p>
        </div>
      </main>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push("/member/dashboard")}
          className="mb-6 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          ← Back to Dashboard
        </button>

        <KYCForm member={member} />
      </div>
    </main>
  );
}