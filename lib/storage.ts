"use client";

import { supabase } from "@/lib/supabase";

const KYC_BUCKET = "kyc-documents";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export type KycDocumentType = "cnic_front" | "cnic_back" | "selfie";

export function validateKycFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WEBP or PDF files are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be 5 MB or less.");
  }
}

export async function uploadKycDocument({
  authUserId,
  documentType,
  file,
}: {
  authUserId: string;
  documentType: KycDocumentType;
  file: File;
}) {
  validateKycFile(file);

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${authUserId}/${documentType}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(KYC_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  return filePath;
}

export async function createSignedKycUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from(KYC_BUCKET)
    .createSignedUrl(filePath, 600);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Unable to open document.");
  }

  return data.signedUrl;
}
