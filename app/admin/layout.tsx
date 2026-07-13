"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

type AdminLayoutProps = {
  children: ReactNode;
};

type Profile = {
  role: "super_admin" | "admin" | "staff" | "member";
  status: "active" | "pending" | "suspended" | "blocked";
};

export default function AdminRouteLayout({
  children,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const isAdminLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      if (isAdminLoginPage) {
        if (isMounted) {
          setIsAuthorized(true);
          setIsChecking(false);
        }
        return;
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          if (isMounted) {
            setIsAuthorized(false);
            setIsChecking(false);
          }

          router.replace("/admin/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("auth_user_id", session.user.id)
          .single();

        if (profileError || !profileData) {
          await supabase.auth.signOut();

          if (isMounted) {
            setIsAuthorized(false);
            setIsChecking(false);
          }

          router.replace("/admin/login");
          return;
        }

        const profile = profileData as Profile;

        const hasAdminRole =
          profile.role === "admin" || profile.role === "super_admin";
        const hasActiveStatus = profile.status === "active";

        if (!hasAdminRole || !hasActiveStatus) {
          await supabase.auth.signOut();

          if (isMounted) {
            setIsAuthorized(false);
            setIsChecking(false);
          }

          router.replace("/admin/login");
          return;
        }

        if (isMounted) {
          setIsAuthorized(true);
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Admin authorization error:", error);

        await supabase.auth.signOut();

        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
        }

        router.replace("/admin/login");
      }
    }

    void checkAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!isAdminLoginPage && event === "SIGNED_OUT") {
        router.replace("/admin/login");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isAdminLoginPage, router]);

  if (isAdminLoginPage) {
    return children;
  }

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-500/15 text-violet-300">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <LoaderCircle className="mx-auto mt-6 h-7 w-7 animate-spin text-violet-400" />

          <h1 className="mt-5 text-xl font-bold">Checking Admin Access</h1>

          <p className="mt-2 text-sm text-slate-400">
            Please wait while your account is being verified.
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}
