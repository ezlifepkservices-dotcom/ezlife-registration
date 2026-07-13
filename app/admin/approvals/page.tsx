"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  LoaderCircle,
  RefreshCcw,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import AdminLayout from "../../../components/admin/AdminLayout";
import { supabase } from "../../../lib/supabase";

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

type RegistrationsResponse = {
  registrations?: Registration[];
  error?: string;
};

type ApprovalResponse = {
  message?: string;
  memberId?: string;
  referralCode?: string;
  credentialsDelivery?: "pending" | "sent" | "failed";
  temporaryPassword?: string | null;
  error?: string;
};

type ApprovalResult = {
  memberName: string;
  email: string;
  memberId: string;
  referralCode: string;
  credentialsDelivery: "pending" | "sent" | "failed";
  temporaryPassword: string | null;
};

const ITEMS_PER_PAGE = 10;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("Admin session not found. Please login again.");
  }

  return session.access_token;
}

export default function AdminApprovalsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [approvalResult, setApprovalResult] =
    useState<ApprovalResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadRegistrations = useCallback(async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const accessToken = await getAccessToken();

      const response = await fetch("/api/admin/registrations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const result = (await response.json()) as RegistrationsResponse;

      if (!response.ok) {
        throw new Error(result.error ?? "Registrations load nahi ho sakin.");
      }

      setRegistrations(
        (result.registrations ?? []).filter(
          (registration) =>
            registration.status.trim().toLowerCase() === "pending",
        ),
      );
      setCurrentPage(1);
    } catch (error) {
      console.error("Approvals loading error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Pending registrations load nahi ho sakin.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const filteredRegistrations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return registrations;
    }

    return registrations.filter((registration) =>
      [
        registration.full_name,
        registration.email,
        registration.mobile,
        registration.whatsapp,
        registration.city,
        registration.interested_service ?? "",
        registration.referred_by ?? "",
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [registrations, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE),
  );

  const paginatedRegistrations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRegistrations.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [currentPage, filteredRegistrations]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  async function handleApprove(registration: Registration) {
    const confirmed = window.confirm(
      `${registration.full_name} ki registration approve karni hai?`,
    );

    if (!confirmed) {
      return;
    }

    setApprovingId(registration.id);

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

      const result = (await response.json()) as ApprovalResponse;

      if (!response.ok) {
        throw new Error(result.error ?? "Registration approve nahi ho saki.");
      }

      setApprovalResult({
        memberName: registration.full_name,
        email: registration.email,
        memberId: result.memberId ?? "Not available",
        referralCode: result.referralCode ?? "Not available",
        credentialsDelivery: result.credentialsDelivery ?? "pending",
        temporaryPassword: result.temporaryPassword ?? null,
      });

      setRegistrations((current) =>
        current.filter((item) => item.id !== registration.id),
      );
      setSelectedRegistration(null);
      toast.success(result.message ?? "Registration approved successfully.");
    } catch (error) {
      console.error("Registration approval error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration approve nahi ho saki.",
      );
    } finally {
      setApprovingId(null);
    }
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error(`${label} copy nahi ho saka.`);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#182b5d] via-[#1f2b58] to-[#3b287c] px-6 py-8 sm:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-violet-300">
                Approval Queue
              </p>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                Pending Approvals
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                Review pending registrations and approve members from one
                compact table.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadRegistrations(true)}
              disabled={isRefreshing}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRefreshing ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCcw className="h-5 w-5" />
              )}
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
          <div className="flex flex-col gap-5 border-b border-white/10 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Registration Requests
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Search, review and approve pending member applications.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search name, mobile, email..."
                  className="h-11 w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40 sm:w-72"
                />
              </div>

              <div className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 text-sm font-semibold text-amber-300">
                <Clock3 className="h-4 w-4" />
                {filteredRegistrations.length} Pending
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center p-8">
              <div className="text-center">
                <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-violet-400" />
                <p className="mt-4 font-semibold text-white">
                  Loading pending registrations
                </p>
              </div>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="flex min-h-72 items-center justify-center p-8">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300">
                  <UserCheck className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">
                  No pending approvals
                </h3>
                <p className="mt-2 leading-7 text-slate-500">
                  New pending registrations yahan automatically nazar aayengi.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full min-w-[1180px] text-left">
                  <thead className="bg-slate-950/40">
                    <tr className="border-b border-white/10">
                      {[
                        "Name",
                        "Mobile",
                        "Email",
                        "City",
                        "Service",
                        "Referred By",
                        "Date",
                        "Status",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                            heading === "Action" ? "text-right" : "text-left"
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedRegistrations.map((registration) => {
                      const isApproving = approvingId === registration.id;

                      return (
                        <tr
                          key={registration.id}
                          className="border-b border-white/10 transition last:border-b-0 hover:bg-white/[0.025]"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-white">
                              {registration.full_name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              WhatsApp: {registration.whatsapp}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-300">
                            {registration.mobile}
                          </td>
                          <td className="max-w-56 px-5 py-4 text-sm text-slate-300">
                            <span className="block truncate">
                              {registration.email}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-300">
                            {registration.city}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-300">
                            {registration.interested_service ?? "Umrah"}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-300">
                            {registration.referred_by ?? "Direct"}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-300">
                            {formatDate(registration.created_at)}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                              Pending
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedRegistration(registration)
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() => handleApprove(registration)}
                                disabled={approvingId !== null}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isApproving ? (
                                  <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                                {isApproving ? "Approving..." : "Approve"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-300">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-300">
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredRegistrations.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-300">
                    {filteredRegistrations.length}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((current) => Math.max(1, current - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <span className="px-3 text-sm text-slate-400">
                    Page <span className="font-semibold text-white">{currentPage}</span>{" "}
                    of <span className="font-semibold text-white">{totalPages}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((current) =>
                        Math.min(totalPages, current + 1),
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 disabled:opacity-40"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {selectedRegistration && (
          <ModalShell onClose={() => setSelectedRegistration(null)}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
                  Registration Details
                </p>
                <h2 className="mt-3 text-2xl font-black text-white">
                  {selectedRegistration.full_name}
                </h2>
              </div>
              <CloseButton onClick={() => setSelectedRegistration(null)} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Email", selectedRegistration.email],
                ["Mobile", selectedRegistration.mobile],
                ["WhatsApp", selectedRegistration.whatsapp],
                ["City", selectedRegistration.city],
                ["Service", selectedRegistration.interested_service ?? "Umrah"],
                ["Referred By", selectedRegistration.referred_by ?? "Direct"],
                ["Registration Date", formatDate(selectedRegistration.created_at)],
                ["Status", "Pending"],
              ].map(([label, value]) => (
                <InfoBox key={label} label={label} value={value} />
              ))}
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="h-11 rounded-xl border border-white/10 px-5 font-semibold text-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedRegistration)}
                disabled={approvingId === selectedRegistration.id}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 font-semibold text-white disabled:opacity-60"
              >
                {approvingId === selectedRegistration.id ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <UserCheck className="h-4 w-4" />
                )}
                Approve Member
              </button>
            </div>
          </ModalShell>
        )}

        {approvalResult && (
          <ModalShell onClose={() => setApprovalResult(null)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                    Approval Successful
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Member Created
                  </h2>
                </div>
              </div>
              <CloseButton onClick={() => setApprovalResult(null)} />
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Member account create ho gaya hai. Password admin panel par show
              nahi kiya jata. Delivery integration complete hone par login
              instructions member ko Email, WhatsApp ya SMS se bheji jayengi.
            </p>

            <div className="mt-6 grid gap-4">
              <CredentialBox label="Member Name" value={approvalResult.memberName} />
              <CredentialBox
                label="Member Email"
                value={approvalResult.email}
                onCopy={() => copyText(approvalResult.email, "Member email")}
              />
              <CredentialBox
                label="Member ID"
                value={approvalResult.memberId}
                onCopy={() => copyText(approvalResult.memberId, "Member ID")}
              />
              <CredentialBox
                label="Referral Code"
                value={approvalResult.referralCode}
                onCopy={() => copyText(approvalResult.referralCode, "Referral code")}
              />
              <CredentialBox
                label="Credentials Delivery"
                value={
                  approvalResult.credentialsDelivery === "sent"
                    ? "Sent"
                    : approvalResult.credentialsDelivery === "failed"
                      ? "Failed"
                      : "Pending — Email / WhatsApp / SMS integration"
                }
              />

              {approvalResult.temporaryPassword && (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Development Only
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Temporary Password
                      </p>

                      <p className="mt-2 break-all font-mono font-semibold text-white">
                        {approvalResult.temporaryPassword}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          approvalResult.temporaryPassword as string,
                          "Temporary password",
                        )
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 text-amber-200 transition hover:bg-amber-300/10"
                      aria-label="Copy temporary password"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-amber-100/70">
                    Ye password sirf local development testing ke liye API se
                    return hota hai. Production par ye section automatically
                    show nahi hoga.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setApprovalResult(null)}
              className="mt-7 h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white"
            >
              Done
            </button>
          </ModalShell>
        )}
      </div>
    </AdminLayout>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
        {children}
      </div>
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
    >
      <X className="h-5 w-5" />
    </button>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-2 break-all font-medium text-white">{value}</p>
    </div>
  );
}

function CredentialBox({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-600">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="min-w-0 break-all font-semibold text-white">{value}</p>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
