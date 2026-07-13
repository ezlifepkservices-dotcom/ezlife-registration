"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "../../../lib/supabase";

type MemberProfile = {
  role: "member" | "admin" | "super_admin" | "staff";
  status: "active" | "pending" | "suspended" | "blocked";
  must_change_password: boolean;
};

export default function MemberChangePasswordPage() {
  const router = useRouter();

  const [memberEmail, setMemberEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyMemberSession() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          router.replace("/member/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, status, must_change_password")
          .eq("auth_user_id", session.user.id)
          .single();

        if (profileError || !profileData) {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        const profile = profileData as MemberProfile;

        if (profile.role !== "member") {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (profile.status === "suspended") {
          router.replace("/member/suspended");
          return;
        }

        if (profile.status !== "active") {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (!profile.must_change_password) {
          router.replace("/member/dashboard");
          return;
        }

        if (isMounted) {
          setMemberEmail(session.user.email ?? "");
          setIsCheckingSession(false);
        }
      } catch (error) {
        console.error("Member session verification error:", error);

        await supabase.auth.signOut();
        router.replace("/member/login");
      }
    }

    verifyMemberSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function getPasswordValidationError(password: string) {
    if (password.length < 8) {
      return "New password kam az kam 8 characters ka hona chahiye.";
    }

    if (!/[A-Z]/.test(password)) {
      return "New password mein kam az kam ek capital letter hona chahiye.";
    }

    if (!/[a-z]/.test(password)) {
      return "New password mein kam az kam ek small letter hona chahiye.";
    }

    if (!/[0-9]/.test(password)) {
      return "New password mein kam az kam ek number hona chahiye.";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return "New password mein kam az kam ek special character hona chahiye.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Tamam password fields complete karein.");
      return;
    }

    const passwordValidationError =
      getPasswordValidationError(newPassword);

    if (passwordValidationError) {
      toast.error(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password aur confirm password match nahi karte.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password current password se different hona chahiye.");
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user || !memberEmail) {
        await supabase.auth.signOut();
        toast.error("Session expire ho gayi hai. Dobara login karein.");
        router.replace("/member/login");
        return;
      }

      const { error: currentPasswordError } =
        await supabase.auth.signInWithPassword({
          email: memberEmail,
          password: currentPassword,
        });

      if (currentPasswordError) {
        toast.error("Current temporary password sahi nahi hai.");
        return;
      }

      const { error: passwordUpdateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (passwordUpdateError) {
        throw new Error(passwordUpdateError.message);
      }

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          must_change_password: false,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", session.user.id);

      if (profileUpdateError) {
        throw new Error(profileUpdateError.message);
      }

      toast.success("Password successfully change ho gaya.");

      router.replace("/member/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Member password change error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Password change nahi ho saka.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-indigo-400" />

          <h1 className="mt-5 text-xl font-bold">
            Checking Member Account
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Please wait while your account is verified.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />

          <Link
            href="/"
            className="relative z-10 inline-flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-black shadow-lg shadow-indigo-950/50">
              EZ
            </div>

            <div>
              <p className="text-xl font-bold">EZ Life</p>
              <p className="text-sm text-slate-400">Member Portal</p>
            </div>
          </Link>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
              <ShieldCheck className="h-4 w-4" />
              Secure First Login
            </div>

            <h1 className="text-4xl font-black leading-tight xl:text-5xl">
              Protect your account with a private password.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Temporary password ko replace karke apna strong aur secure
              password set karein.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <SecurityPoint text="Minimum 8 characters" />
            <SecurityPoint text="Capital aur small letters" />
            <SecurityPoint text="Number aur special character" />
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
                <p className="text-xs text-slate-500">Member Portal</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                  <KeyRound className="h-7 w-7" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                  Change Password
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Create your password
                </h2>

                <p className="mt-3 leading-7 text-slate-400">
                  Account access continue karne ke liye temporary password
                  replace karein.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <PasswordField
                  id="current-password"
                  label="Current Temporary Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  showPassword={showCurrentPassword}
                  onToggle={() =>
                    setShowCurrentPassword((currentValue) => !currentValue)
                  }
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />

                <PasswordField
                  id="new-password"
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  showPassword={showNewPassword}
                  onToggle={() =>
                    setShowNewPassword((currentValue) => !currentValue)
                  }
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />

                <PasswordField
                  id="confirm-password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  showPassword={showConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword((currentValue) => !currentValue)
                  }
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-lg shadow-indigo-950/50 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <LockKeyhole className="h-5 w-5" />
                  )}

                  {isSubmitting
                    ? "Updating Password..."
                    : "Save New Password"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggle: () => void;
  disabled: boolean;
  autoComplete: "current-password" | "new-password";
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggle,
  disabled,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-12 pr-14 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
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
  );
}

function SecurityPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      <span>{text}</span>
    </div>
  );
}