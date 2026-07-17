"use client";

import {
  CheckCircle2,
  FileImage,
  LoaderCircle,
  Save,
  Send,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  type KycDocumentType,
  uploadKycDocument,
} from "@/lib/storage";
import { supabase } from "@/lib/supabase";

type MemberContext = {
  authUserId: string;
  memberId: string;
  fullName: string;
  email: string;
};

type KycStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected";

type KycRecord = {
  id: string;
  cnic_number: string | null;
  father_or_husband_name: string | null;
  date_of_birth: string | null;
  passport_number: string | null;
  passport_expiry_date: string | null;
  residential_address: string | null;
  city: string | null;
  profession: string | null;
  monthly_income: number | null;
  next_of_kin_name: string | null;
  next_of_kin_relationship: string | null;
  next_of_kin_mobile: string | null;
  next_of_kin_cnic: string | null;
  next_of_kin_passport_number: string | null;
  next_of_kin_passport_expiry_date: string | null;
  status: KycStatus;
  rejection_reason: string | null;
};

type DocumentRecord = {
  id: string;
  document_type: KycDocumentType;
  file_path: string;
  status: "pending" | "approved" | "resubmit_required" | "rejected";
  review_comment: string | null;
  version_no: number;
};

type Props = {
  member: MemberContext;
};

const selectColumns =
  "id, cnic_number, father_or_husband_name, date_of_birth, passport_number, passport_expiry_date, residential_address, city, profession, monthly_income, next_of_kin_name, next_of_kin_relationship, next_of_kin_mobile, next_of_kin_cnic, next_of_kin_passport_number, next_of_kin_passport_expiry_date, status, rejection_reason";

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const documentLabels: Record<KycDocumentType, string> = {
  cnic_front: "CNIC Front",
  cnic_back: "CNIC Back",
  passport: "Passport First Page",
  selfie: "Selfie / Profile Photo",
};

const requiredDocumentTypes: KycDocumentType[] = [
  "cnic_front",
  "cnic_back",
  "passport",
  "selfie",
];

const relationships = [
  "Father",
  "Mother",
  "Husband",
  "Wife",
  "Brother",
  "Sister",
  "Son",
  "Daughter",
  "Other",
];

export default function KYCForm({ member }: Props) {
  const [kyc, setKyc] = useState<KycRecord | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [files, setFiles] = useState<
    Partial<Record<KycDocumentType, File>>
  >({});
  const [form, setForm] = useState({
    cnic_number: "",
    father_or_husband_name: "",
    date_of_birth: "",
    passport_number: "",
    passport_expiry_date: "",
    residential_address: "",
    city: "",
    profession: "",
    monthly_income: "",
    next_of_kin_name: "",
    next_of_kin_relationship: "",
    next_of_kin_mobile: "",
    next_of_kin_cnic: "",
    next_of_kin_passport_number: "",
    next_of_kin_passport_expiry_date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingType, setUploadingType] =
    useState<KycDocumentType | null>(null);

  async function loadKyc() {
    setIsLoading(true);

    try {
      const { data: rows, error } = await supabase
        .from("member_kyc")
        .select(selectColumns)
        .eq("member_id", member.memberId)
        .limit(1);

      if (error) {
        throw new Error(error.message);
      }

      const current = (rows?.[0] as KycRecord | undefined) ?? null;

      if (!current) {
        setKyc(null);
        setDocuments([]);
        return;
      }

      const { data: documentRows, error: documentError } =
        await supabase
          .from("kyc_documents")
          .select(
            "id, document_type, file_path, status, review_comment, version_no",
          )
          .eq("kyc_id", current.id)
          .order("created_at", { ascending: false });

      if (documentError) {
        throw new Error(documentError.message);
      }

      setKyc(current);
      setDocuments((documentRows ?? []) as DocumentRecord[]);
      setForm({
        cnic_number: current.cnic_number ?? "",
        father_or_husband_name:
          current.father_or_husband_name ?? "",
        date_of_birth: current.date_of_birth ?? "",
        passport_number: current.passport_number ?? "",
        passport_expiry_date: current.passport_expiry_date ?? "",
        residential_address: current.residential_address ?? "",
        city: current.city ?? "",
        profession: current.profession ?? "",
        monthly_income: current.monthly_income?.toString() ?? "",
        next_of_kin_name: current.next_of_kin_name ?? "",
        next_of_kin_relationship:
          current.next_of_kin_relationship ?? "",
        next_of_kin_mobile: current.next_of_kin_mobile ?? "",
        next_of_kin_cnic: current.next_of_kin_cnic ?? "",
        next_of_kin_passport_number:
          current.next_of_kin_passport_number ?? "",
        next_of_kin_passport_expiry_date:
          current.next_of_kin_passport_expiry_date ?? "",
      });
    } catch (error) {
      console.error("KYC load error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "KYC data load nahi ho saka.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadKyc();
  }, [member.memberId]);

  // Rejected KYC must be editable.
  const isLocked = useMemo(
    () =>
      kyc?.status === "submitted" ||
      kyc?.status === "under_review" ||
      kyc?.status === "verified",
    [kyc?.status],
  );

  const isCorrectionMode = kyc?.status === "rejected";

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveKycDetails(status: KycStatus) {
    const payload = {
      member_id: member.memberId,
      cnic_number: form.cnic_number.trim() || null,
      father_or_husband_name:
        form.father_or_husband_name.trim() || null,
      date_of_birth: form.date_of_birth || null,
      passport_number: form.passport_number.trim() || null,
      passport_expiry_date: form.passport_expiry_date || null,
      residential_address:
        form.residential_address.trim() || null,
      city: form.city.trim() || null,
      profession: form.profession.trim() || null,
      monthly_income: form.monthly_income
        ? Number(form.monthly_income)
        : null,
      next_of_kin_name:
        form.next_of_kin_name.trim() || null,
      next_of_kin_relationship:
        form.next_of_kin_relationship || null,
      next_of_kin_mobile:
        form.next_of_kin_mobile.trim() || null,
      next_of_kin_cnic:
        form.next_of_kin_cnic.trim() || null,
      next_of_kin_passport_number:
        form.next_of_kin_passport_number.trim() || null,
      next_of_kin_passport_expiry_date:
        form.next_of_kin_passport_expiry_date || null,
      status,
      submitted_at:
        status === "submitted" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const query = kyc
      ? supabase
          .from("member_kyc")
          .update(payload)
          .eq("id", kyc.id)
      : supabase.from("member_kyc").insert(payload);

    const { data, error } = await query
      .select(selectColumns)
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "KYC save failed.");
    }

    setKyc(data as KycRecord);
    return data as KycRecord;
  }

  async function uploadSelectedDocument(
    documentType: KycDocumentType,
    kycRecord: KycRecord,
  ) {
    const file = files[documentType];

    if (!file) {
      return;
    }

    setUploadingType(documentType);

    try {
      const filePath = await uploadKycDocument({
        authUserId: member.authUserId,
        documentType,
        file,
      });

      const existing = documents.find(
        (document) => document.document_type === documentType,
      );

      if (existing) {
        const { error } = await supabase
          .from("kyc_documents")
          .update({
            file_path: filePath,
            status: "pending",
            review_reason_id: null,
            review_comment: null,
            reviewed_by: null,
            reviewed_at: null,
            resubmitted_at: new Date().toISOString(),
            version_no: existing.version_no + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        const { error } = await supabase
          .from("kyc_documents")
          .insert({
            kyc_id: kycRecord.id,
            member_id: member.memberId,
            document_type: documentType,
            file_path: filePath,
            status: "pending",
            version_no: 1,
          });

        if (error) {
          throw new Error(error.message);
        }
      }
    } finally {
      setUploadingType(null);
    }
  }

  async function getCurrentDocuments(kycId: string) {
    const { data, error } = await supabase
      .from("kyc_documents")
      .select(
        "id, document_type, file_path, status, review_comment, version_no",
      )
      .eq("kyc_id", kycId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as DocumentRecord[];
  }

  async function saveKyc(submit: boolean) {
    if (isLocked) {
      return;
    }

    if (submit) {
      const requiredValues = [
        form.cnic_number,
        form.father_or_husband_name,
        form.date_of_birth,
        form.passport_number,
        form.passport_expiry_date,
        form.residential_address,
        form.city,
        form.next_of_kin_name,
        form.next_of_kin_relationship,
        form.next_of_kin_mobile,
        form.next_of_kin_cnic,
      ];

      if (requiredValues.some((value) => !value.trim())) {
        toast.error(
          "Please complete all required personal, passport and next-of-kin fields.",
        );
        return;
      }
    }

    setIsSaving(true);

    try {
      // Draft first. Submitted only after all uploads succeed.
      const kycRecord = await saveKycDetails("draft");

      for (const documentType of requiredDocumentTypes) {
        await uploadSelectedDocument(documentType, kycRecord);
      }

      const currentDocuments = await getCurrentDocuments(kycRecord.id);
      setDocuments(currentDocuments);

      if (!submit) {
        setFiles({});
        toast.success("KYC draft saved.");
        return;
      }

      const uploadedTypes = new Set(
        currentDocuments.map((document) => document.document_type),
      );

      const missing = requiredDocumentTypes.filter(
        (type) => !uploadedTypes.has(type),
      );

      if (missing.length > 0) {
        toast.error(
          `Please upload: ${missing
            .map((type) => documentLabels[type])
            .join(", ")}`,
        );
        return;
      }

      if (isCorrectionMode) {
        const unresolved = currentDocuments.filter((document) =>
          ["resubmit_required", "rejected"].includes(document.status),
        );

        if (unresolved.length > 0) {
          toast.error(
            "Please replace every document marked for resubmission.",
          );
          return;
        }
      }

      const { data, error } = await supabase
        .from("member_kyc")
        .update({
          status: "submitted",
          submitted_at: new Date().toISOString(),
          rejection_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", kycRecord.id)
        .select(selectColumns)
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "KYC submit failed.");
      }

      setKyc(data as KycRecord);
      setFiles({});
      toast.success("KYC submitted for admin review.");
    } catch (error) {
      console.error("KYC save error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "KYC save nahi ho saka.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-violet-300" />
        <p className="mt-4 text-slate-400">Loading your KYC...</p>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Member Verification
          </p>
          <h1 className="mt-3 text-3xl font-black">
            Complete Your KYC
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Complete personal, passport and next-of-kin information.
          </p>
        </div>

        <span className="self-start rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-semibold capitalize text-violet-200">
          {(kyc?.status ?? "not_started").replaceAll("_", " ")}
        </span>
      </div>

      {isCorrectionMode && (
        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          <p className="font-black">Action Required</p>
          <p className="mt-2 leading-6">
            Your form is unlocked. Correct the information or replace the
            requested documents, then resubmit.
          </p>
        </div>
      )}

      {kyc?.rejection_reason && (
        <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          <strong>Admin note:</strong> {kyc.rejection_reason}
        </div>
      )}

      <SectionTitle title="Personal Information" />
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <ReadOnlyField label="Full Name" value={member.fullName} />
        <ReadOnlyField label="Email" value={member.email} />
        <TextField
          label="CNIC Number *"
          value={form.cnic_number}
          onChange={(value) => updateField("cnic_number", value)}
          placeholder="42101-1234567-1"
          disabled={isLocked}
        />
        <TextField
          label="Father / Husband Name *"
          value={form.father_or_husband_name}
          onChange={(value) =>
            updateField("father_or_husband_name", value)
          }
          placeholder="Enter full name"
          disabled={isLocked}
        />
        <TextField
          label="Date of Birth *"
          value={form.date_of_birth}
          onChange={(value) => updateField("date_of_birth", value)}
          type="date"
          disabled={isLocked}
        />
        <TextField
          label="City *"
          value={form.city}
          onChange={(value) => updateField("city", value)}
          placeholder="Karachi"
          disabled={isLocked}
        />
        <TextField
          label="Profession"
          value={form.profession}
          onChange={(value) => updateField("profession", value)}
          placeholder="Profession"
          disabled={isLocked}
        />
        <TextField
          label="Monthly Income"
          value={form.monthly_income}
          onChange={(value) => updateField("monthly_income", value)}
          placeholder="100000"
          type="number"
          disabled={isLocked}
        />
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-200">
          Residential Address *
        </label>
        <textarea
          value={form.residential_address}
          onChange={(event) =>
            updateField("residential_address", event.target.value)
          }
          placeholder="Complete residential address"
          disabled={isLocked}
          rows={4}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <SectionTitle title="Passport Information" />
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <TextField
          label="Passport Number *"
          value={form.passport_number}
          onChange={(value) => updateField("passport_number", value)}
          placeholder="AB1234567"
          disabled={isLocked}
        />
        <TextField
          label="Passport Expiry Date *"
          value={form.passport_expiry_date}
          onChange={(value) =>
            updateField("passport_expiry_date", value)
          }
          type="date"
          disabled={isLocked}
        />
      </div>

      <SectionTitle title="Emergency Contact / Next of Kin" />
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <TextField
          label="Full Name *"
          value={form.next_of_kin_name}
          onChange={(value) =>
            updateField("next_of_kin_name", value)
          }
          placeholder="Next of kin full name"
          disabled={isLocked}
        />

        <div>
          <label className="text-sm font-bold text-slate-200">
            Relationship *
          </label>
          <select
            value={form.next_of_kin_relationship}
            onChange={(event) =>
              updateField(
                "next_of_kin_relationship",
                event.target.value,
              )
            }
            disabled={isLocked}
            className={fieldClass}
          >
            <option value="">Select relationship</option>
            {relationships.map((relationship) => (
              <option key={relationship} value={relationship}>
                {relationship}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Mobile Number *"
          value={form.next_of_kin_mobile}
          onChange={(value) =>
            updateField("next_of_kin_mobile", value)
          }
          placeholder="03XXXXXXXXX"
          disabled={isLocked}
        />
        <TextField
          label="CNIC Number *"
          value={form.next_of_kin_cnic}
          onChange={(value) =>
            updateField("next_of_kin_cnic", value)
          }
          placeholder="42101-1234567-1"
          disabled={isLocked}
        />
        <TextField
          label="Passport Number"
          value={form.next_of_kin_passport_number}
          onChange={(value) =>
            updateField("next_of_kin_passport_number", value)
          }
          placeholder="Optional"
          disabled={isLocked}
        />
        <TextField
          label="Passport Expiry Date"
          value={form.next_of_kin_passport_expiry_date}
          onChange={(value) =>
            updateField(
              "next_of_kin_passport_expiry_date",
              value,
            )
          }
          type="date"
          disabled={isLocked}
        />
      </div>

      <SectionTitle title="KYC Documents" />
      <p className="mt-2 text-sm text-slate-500">
        JPG, PNG, WEBP or PDF. Maximum file size 5 MB.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {requiredDocumentTypes.map((documentType) => {
          const existing = documents.find(
            (document) =>
              document.document_type === documentType,
          );

          // On rejected KYC, every document may be replaced.
          const canReplace =
            !isLocked &&
            (isCorrectionMode ||
              !existing ||
              existing.status === "pending" ||
              existing.status === "resubmit_required" ||
              existing.status === "rejected");

          return (
            <DocumentPicker
              key={documentType}
              label={documentLabels[documentType]}
              file={files[documentType]}
              document={existing}
              disabled={
                !canReplace || uploadingType === documentType
              }
              isUploading={uploadingType === documentType}
              onChange={(file) =>
                setFiles((current) => ({
                  ...current,
                  [documentType]: file,
                }))
              }
            />
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => void saveKyc(false)}
          disabled={isSaving || isLocked}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 font-bold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Save Draft
        </button>

        <button
          type="button"
          onClick={() => void saveKyc(true)}
          disabled={isSaving || isLocked}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          {isCorrectionMode ? "Resubmit KYC" : "Submit KYC"}
        </button>
      </div>
    </section>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mt-10 border-t border-slate-800 pt-7">
      <h2 className="text-xl font-black">{title}</h2>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-200">
        {label}
      </label>
      <div className={`${fieldClass} flex items-center text-slate-400`}>
        {value}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-200">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={fieldClass}
      />
    </div>
  );
}

function DocumentPicker({
  label,
  file,
  document,
  disabled,
  isUploading,
  onChange,
}: {
  label: string;
  file?: File;
  document?: DocumentRecord;
  disabled: boolean;
  isUploading: boolean;
  onChange: (file: File | undefined) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{label}</h3>
          <p className="mt-1 text-xs capitalize text-slate-500">
            Status:{" "}
            {document?.status?.replaceAll("_", " ") ?? "not uploaded"}
          </p>
          {document && (
            <p className="mt-1 text-xs text-slate-600">
              Version {document.version_no}
            </p>
          )}
        </div>

        {document?.status === "approved" ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        ) : (
          <FileImage className="h-5 w-5 text-violet-300" />
        )}
      </div>

      {document?.review_comment && (
        <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200">
          {document.review_comment}
        </p>
      )}

      <label
        className={`mt-4 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 p-4 text-center ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-violet-400"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          disabled={disabled}
          onChange={(event) =>
            onChange(event.target.files?.[0])
          }
          className="hidden"
        />

        <div>
          {isUploading ? (
            <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-violet-300" />
          ) : (
            <Upload className="mx-auto h-6 w-6 text-violet-300" />
          )}

          <p className="mt-2 text-sm font-semibold text-slate-300">
            {file?.name ??
              (document
                ? "Choose replacement file"
                : "Choose file")}
          </p>
        </div>
      </label>
    </div>
  );
}
