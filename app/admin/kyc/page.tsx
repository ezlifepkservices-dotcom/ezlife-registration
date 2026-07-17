"use client";

import {
  CheckCircle2,
  ExternalLink,
  FileWarning,
  LoaderCircle,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { createSignedKycUrl } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

type KycStatus =
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected"
  | "draft"
  | "not_started";

type KycRow = {
  id: string;
  member_id: string;
  cnic_number: string | null;
  father_or_husband_name: string | null;
  date_of_birth: string | null;
  residential_address: string | null;
  city: string | null;
  profession: string | null;
  monthly_income: number | null;
  passport_number: string | null;
  passport_expiry_date: string | null;
  next_of_kin_name: string | null;
  next_of_kin_relationship: string | null;
  next_of_kin_mobile: string | null;
  next_of_kin_cnic: string | null;
  next_of_kin_passport_number: string | null;
  next_of_kin_passport_expiry_date: string | null;
  status: KycStatus;
  rejection_reason: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
};

type MemberRow = {
  id: string;
  full_name: string;
  email: string;
  mobile: string | null;
  referral_code: string;
};

type DocumentType = "cnic_front" | "cnic_back" | "passport" | "selfie";

type DocumentRow = {
  id: string;
  kyc_id: string;
  member_id: string;
  document_type: DocumentType;
  file_path: string;
  status: "pending" | "approved" | "resubmit_required" | "rejected";
  review_reason_id: string | null;
  review_comment: string | null;
  version_no: number;
  reviewed_at: string | null;
};

type ReasonRow = {
  id: string;
  module: string;
  category: string | null;
  title: string;
  member_message: string;
  action_required: string | null;
};

type ReviewRecord = {
  kyc: KycRow;
  member: MemberRow;
  documents: DocumentRow[];
};

const documentLabels: Record<DocumentType, string> = {
  cnic_front: "CNIC Front",
  cnic_back: "CNIC Back",
  passport: "Passport First Page",
  selfie: "Selfie",
};

export default function AdminKycPage() {
  const [records, setRecords] = useState<ReviewRecord[]>([]);
  const [reasons, setReasons] = useState<ReasonRow[]>([]);
  const [selected, setSelected] = useState<ReviewRecord | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingDocumentId, setSavingDocumentId] = useState<string | null>(null);
  const [isSavingKyc, setIsSavingKyc] = useState(false);

  async function loadData() {
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/admin/login";
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("auth_user_id", session.user.id)
        .single();

      if (
        profileError ||
        !profile ||
        profile.role !== "admin" ||
        profile.status !== "active"
      ) {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
        return;
      }

      const { data: kycRows, error: kycError } = await supabase
        .from("member_kyc")
        .select(
          "id, member_id, cnic_number, father_or_husband_name, date_of_birth, passport_number, passport_expiry_date, residential_address, city, profession, monthly_income, next_of_kin_name, next_of_kin_relationship, next_of_kin_mobile, next_of_kin_cnic, next_of_kin_passport_number, next_of_kin_passport_expiry_date, status, rejection_reason, submitted_at, reviewed_at",
        )
        .in("status", ["submitted", "under_review", "rejected", "verified"])
        .order("submitted_at", { ascending: false });

      if (kycError) throw new Error(kycError.message);

      const memberIds = [...new Set((kycRows ?? []).map((row) => row.member_id))];
      const kycIds = (kycRows ?? []).map((row) => row.id);

      const [membersResult, documentsResult, reasonsResult] = await Promise.all([
        memberIds.length
          ? supabase
              .from("members")
              .select("id, full_name, email, mobile, referral_code")
              .in("id", memberIds)
          : Promise.resolve({ data: [], error: null }),

        kycIds.length
          ? supabase
              .from("kyc_documents")
              .select(
                "id, kyc_id, member_id, document_type, file_path, status, review_reason_id, review_comment, version_no, reviewed_at",
              )
              .in("kyc_id", kycIds)
              .order("created_at", { ascending: false })
          : Promise.resolve({ data: [], error: null }),

        supabase
          .from("review_reasons")
          .select(
            "id, module, category, title, member_message, action_required",
          )
          .eq("module", "kyc")
          .eq("is_active", true)
          .order("display_order", { ascending: true }),
      ]);

      if (membersResult.error) throw new Error(membersResult.error.message);
      if (documentsResult.error) throw new Error(documentsResult.error.message);
      if (reasonsResult.error) throw new Error(reasonsResult.error.message);

      const members = (membersResult.data ?? []) as MemberRow[];
      const documents = (documentsResult.data ?? []) as DocumentRow[];

      const mapped = ((kycRows ?? []) as KycRow[])
        .map((kyc) => {
          const member = members.find((item) => item.id === kyc.member_id);
          if (!member) return null;

          return {
            kyc,
            member,
            documents: documents.filter((item) => item.kyc_id === kyc.id),
          };
        })
        .filter((item): item is ReviewRecord => Boolean(item));

      setRecords(mapped);
      setReasons((reasonsResult.data ?? []) as ReasonRow[]);
      setSelected((current) => {
        if (!current) return mapped[0] ?? null;
        return (
          mapped.find((item) => item.kyc.id === current.kyc.id) ??
          mapped[0] ??
          null
        );
      });
    } catch (error) {
      console.error("Admin KYC load error:", error);
      toast.error(
        error instanceof Error ? error.message : "KYC data load nahi ho saka.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;

    return records.filter(({ member, kyc }) =>
      [
        member.full_name,
        member.email,
        member.mobile ?? "",
        member.referral_code,
        kyc.cnic_number ?? "",
        kyc.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [records, search]);

  async function openDocument(filePath: string) {
    try {
      const signedUrl = await createSignedKycUrl(filePath);
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Document open nahi ho saka.",
      );
    }
  }

  async function updateDocument(
    document: DocumentRow,
    nextStatus: DocumentRow["status"],
    reasonId: string | null,
    comment: string,
  ) {
    setSavingDocumentId(document.id);

    try {
      const reason = reasons.find((item) => item.id === reasonId);
      const reviewComment =
        comment.trim() ||
        reason?.member_message ||
        reason?.action_required ||
        null;

      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("kyc_documents")
        .update({
          status: nextStatus,
          review_reason_id: reasonId,
          review_comment: reviewComment,
          reviewed_by: userData.user?.id ?? null,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", document.id);

      if (error) throw new Error(error.message);

      toast.success(`${documentLabels[document.document_type]} updated.`);
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Document update failed.",
      );
    } finally {
      setSavingDocumentId(null);
    }
  }

  async function finalizeKyc(status: "verified" | "rejected") {
    if (!selected) return;

    const allApproved =
      selected.documents.length === 4 &&
      selected.documents.every((document) => document.status === "approved");

    if (status === "verified" && !allApproved) {
      toast.error("All four documents must be approved first.");
      return;
    }

    setIsSavingKyc(true);

    try {
      const { data: userData } = await supabase.auth.getUser();

      const rejectedDocuments = selected.documents.filter((document) =>
        ["resubmit_required", "rejected"].includes(document.status),
      );

      const rejectionReason =
        status === "rejected"
          ? rejectedDocuments
              .map(
                (document) =>
                  `${documentLabels[document.document_type]}: ${
                    document.review_comment ?? "Correction required"
                  }`,
              )
              .join(" | ") || "KYC requires correction."
          : null;

      if (status === "rejected") {
        const { error: documentReturnError } = await supabase
          .from("kyc_documents")
          .update({
            status: "resubmit_required",
            review_comment:
              rejectionReason || "KYC requires correction. Please review and resubmit.",
            reviewed_by: userData.user?.id ?? null,
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("kyc_id", selected.kyc.id);

        if (documentReturnError) {
          throw new Error(documentReturnError.message);
        }
      }

      const { error } = await supabase
        .from("member_kyc")
        .update({
          status,
          rejection_reason: rejectionReason,
          reviewed_by: userData.user?.id ?? null,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.kyc.id);

      if (error) throw new Error(error.message);

      toast.success(
        status === "verified"
          ? "KYC approved."
          : "KYC returned for correction.",
      );

      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "KYC update failed.",
      );
    } finally {
      setIsSavingKyc(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
              Admin Review
            </p>
            <h1 className="mt-3 text-3xl font-black">KYC Verification</h1>
            <p className="mt-2 text-slate-400">
              Review member information and approve or return individual
              documents.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search member or CNIC"
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4 text-white outline-none focus:border-violet-400"
              />
            </div>

            <div className="mt-4 max-h-[72vh] space-y-3 overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-12 text-center">
                  <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-violet-300" />
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
                  No KYC record found.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <button
                    key={record.kyc.id}
                    type="button"
                    onClick={() => setSelected(record)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected?.kyc.id === record.kyc.id
                        ? "border-violet-400/50 bg-violet-500/10"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{record.member.full_name}</p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {record.member.email}
                        </p>
                      </div>
                      <StatusBadge status={record.kyc.status} />
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      CNIC: {record.kyc.cnic_number ?? "Not provided"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="min-w-0">
            {!selected ? (
              <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900 p-8 text-center text-slate-500">
                Select a member KYC record.
              </div>
            ) : (
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                        <UserRound className="h-6 w-6" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-black">
                          {selected.member.full_name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                          {selected.member.email}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={selected.kyc.status} />
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Info label="Mobile" value={selected.member.mobile ?? "—"} />
                    <Info label="CNIC" value={selected.kyc.cnic_number ?? "—"} />
                    <Info
                      label="Father / Husband"
                      value={selected.kyc.father_or_husband_name ?? "—"}
                    />
                    <Info
                      label="Date of Birth"
                      value={selected.kyc.date_of_birth ?? "—"}
                    />
                    <Info label="City" value={selected.kyc.city ?? "—"} />
                    <Info
                      label="Profession"
                      value={selected.kyc.profession ?? "—"}
                    />
                    <Info
                      label="Monthly Income"
                      value={
                        selected.kyc.monthly_income?.toLocaleString("en-PK") ??
                        "—"
                      }
                    />
                    <Info
                      label="Address"
                      value={selected.kyc.residential_address ?? "—"}
                      wide
                    />
                  </div>
                </section>

                <section className="grid gap-5 lg:grid-cols-3">
                  {(["cnic_front", "cnic_back", "passport", "selfie"] as DocumentType[]).map(
                    (documentType) => {
                      const document = selected.documents.find(
                        (item) => item.document_type === documentType,
                      );

                      return (
                        <DocumentReviewCard
                          key={documentType}
                          label={documentLabels[documentType]}
                          document={document}
                          reasons={reasons}
                          isSaving={savingDocumentId === document?.id}
                          onOpen={() =>
                            document
                              ? void openDocument(document.file_path)
                              : undefined
                          }
                          onUpdate={(status, reasonId, comment) =>
                            document
                              ? void updateDocument(
                                  document,
                                  status,
                                  reasonId,
                                  comment,
                                )
                              : undefined
                          }
                        />
                      );
                    },
                  )}
                </section>

                <section className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => void finalizeKyc("rejected")}
                    disabled={isSavingKyc}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 font-bold text-amber-200 transition hover:bg-amber-400/15 disabled:opacity-50"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Return for Correction
                  </button>

                  <button
                    type="button"
                    onClick={() => void finalizeKyc("verified")}
                    disabled={isSavingKyc}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-black text-white transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isSavingKyc ? (
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-5 w-5" />
                    )}
                    Approve Complete KYC
                  </button>
                </section>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: KycStatus }) {
  const classes =
    status === "verified"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : status === "rejected"
        ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
        : "border-amber-400/20 bg-amber-400/10 text-amber-300";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function Info({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-950 p-4 ${
        wide ? "sm:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-slate-300">
        {value}
      </p>
    </div>
  );
}

function DocumentReviewCard({
  label,
  document,
  reasons,
  isSaving,
  onOpen,
  onUpdate,
}: {
  label: string;
  document?: DocumentRow;
  reasons: ReasonRow[];
  isSaving: boolean;
  onOpen: () => void;
  onUpdate: (
    status: DocumentRow["status"],
    reasonId: string | null,
    comment: string,
  ) => void;
}) {
  const [reasonId, setReasonId] = useState("");
  const [comment, setComment] = useState("");

  if (!document) {
    return (
      <article className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-5">
        <FileWarning className="h-7 w-7 text-rose-300" />
        <h3 className="mt-4 font-black">{label}</h3>
        <p className="mt-2 text-sm text-rose-200/70">
          Document not uploaded.
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{label}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Version {document.version_no}
          </p>
        </div>

        <DocumentStatusIcon status={document.status} />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold text-slate-300 transition hover:border-violet-400 hover:text-white"
      >
        <ExternalLink className="h-4 w-4" />
        Open Document
      </button>

      <select
        value={reasonId}
        onChange={(event) => setReasonId(event.target.value)}
        className="mt-4 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-violet-400"
      >
        <option value="">Select reason when correction is required</option>
        {reasons.map((reason) => (
          <option key={reason.id} value={reason.id}>
            {reason.title}
          </option>
        ))}
      </select>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        rows={3}
        placeholder="Additional comment for member"
        className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onUpdate("approved", null, "")}
          disabled={isSaving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          Approve
        </button>

        <button
          type="button"
          onClick={() => {
            if (!reasonId && !comment.trim()) {
              toast.error("Select a reason or enter a comment.");
              return;
            }

            onUpdate("resubmit_required", reasonId || null, comment);
          }}
          disabled={isSaving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {isSaving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Resubmit
        </button>
      </div>

      {document.review_comment && (
        <p className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs leading-5 text-slate-400">
          Last comment: {document.review_comment}
        </p>
      )}
    </article>
  );
}

function DocumentStatusIcon({
  status,
}: {
  status: DocumentRow["status"];
}) {
  if (status === "approved") {
    return <CheckCircle2 className="h-6 w-6 text-emerald-400" />;
  }

  if (status === "resubmit_required") {
    return <RotateCcw className="h-6 w-6 text-amber-400" />;
  }

  if (status === "rejected") {
    return <XCircle className="h-6 w-6 text-rose-400" />;
  }

  return <FileWarning className="h-6 w-6 text-slate-500" />;
}
