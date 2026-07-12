"use client";

import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";

type Registration = {
  id: string;
  full_name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  city: string;
  interested_service: string | null;
  referred_by: string | null;
  status: string;
  created_at: string;
};

type ApprovalCredentials = {
  email: string;
  referralCode: string;
  temporaryPassword: string;
};

export default function LatestRegistrations() {
  const [registrations, setRegistrations] = useState<
    Registration[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(
    null,
  );

  const [credentials, setCredentials] =
    useState<ApprovalCredentials | null>(null);

  const getAccessToken = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      throw new Error(
        "Admin session nahi mili. Dobara login karein.",
      );
    }

    return session.access_token;
  };

  const loadRegistrations = useCallback(async () => {
    setIsLoading(true);

    try {
      const accessToken = await getAccessToken();

      const response = await fetch("/api/admin/registrations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const result = (await response.json()) as {
        registrations?: Registration[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "Registrations load nahi ho sakin.",
        );
      }

      setRegistrations(result.registrations ?? []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registrations load nahi ho sakin.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRegistrations();
  }, [loadRegistrations]);

  const approveRegistration = async (
    registration: Registration,
  ) => {
    const confirmed = window.confirm(
      `${registration.full_name} ki registration approve karni hai?`,
    );

    if (!confirmed) {
      return;
    }

    setApprovingId(registration.id);
    setCredentials(null);

    try {
      const accessToken = await getAccessToken();

      const response = await fetch("/api/admin/registrations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationId: registration.id,
        }),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
        referralCode?: string;
        temporaryPassword?: string | null;
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "Registration approve nahi ho saki.",
        );
      }

      toast.success(
        result.message ?? "Registration approved successfully.",
      );

      if (
        result.referralCode &&
        result.temporaryPassword
      ) {
        setCredentials({
          email: registration.email,
          referralCode: result.referralCode,
          temporaryPassword: result.temporaryPassword,
        });
      }

      await loadRegistrations();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration approve nahi ho saki.";

      toast.error(message);
    } finally {
      setApprovingId(null);
    }
  };

  const formatDate = (value: string) => {
    return new Intl.DateTimeFormat("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Live Registration Queue
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Latest Registrations
          </h2>
        </div>

        <button
          type="button"
          onClick={() => void loadRegistrations()}
          disabled={isLoading}
          aria-label="Refresh registrations"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={isLoading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {credentials && (
        <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="font-black text-emerald-300">
            Member account created
          </p>

          <div className="mt-3 space-y-2 text-sm text-slate-200">
            <p>
              Email:{" "}
              <strong className="text-white">
                {credentials.email}
              </strong>
            </p>

            <p>
              Temporary Password:{" "}
              <strong className="font-mono text-white">
                {credentials.temporaryPassword}
              </strong>
            </p>

            <p>
              Referral Code:{" "}
              <strong className="font-mono text-white">
                {credentials.referralCode}
              </strong>
            </p>
          </div>

          <p className="mt-3 text-xs leading-5 text-emerald-200/70">
            Ye temporary password sirf abhi dikhaya ja raha hai.
            Member ko safely provide karein.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-52 items-center justify-center">
          <LoaderCircle
            size={32}
            className="animate-spin text-violet-300"
          />
        </div>
      ) : registrations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">
          <CheckCircle2
            size={34}
            className="mx-auto text-emerald-300"
          />

          <p className="mt-4 font-bold text-white">
            No registrations found
          </p>

          <p className="mt-2 text-sm text-slate-500">
            New customer registrations yahan appear hongi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((registration) => {
            const isPending =
              registration.status.toLowerCase() === "pending";

            const isApproving =
              approvingId === registration.id;

            return (
              <article
                key={registration.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">
                        {registration.full_name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {registration.city} · {registration.mobile}
                      </p>

                      <p className="mt-1 break-all text-xs text-slate-600">
                        {registration.email}
                      </p>

                      <p className="mt-2 text-xs text-slate-600">
                        {formatDate(registration.created_at)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                        isPending
                          ? "bg-orange-500/10 text-orange-300"
                          : "bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {isPending ? (
                        <Clock3 size={14} />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}

                      {registration.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="text-xs text-slate-500">
                      Referred by:{" "}
                      <span className="font-bold text-violet-300">
                        {registration.referred_by ?? "Not provided"}
                      </span>
                    </p>

                    {isPending && (
                      <button
                        type="button"
                        onClick={() =>
                          void approveRegistration(registration)
                        }
                        disabled={
                          isApproving ||
                          approvingId !== null
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isApproving ? (
                          <LoaderCircle
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <UserCheck size={16} />
                        )}

                        {isApproving
                          ? "Approving..."
                          : "Approve"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}