"use client";

import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  PackageCheck,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type MemberContext = {
  memberId: string;
  fullName: string;
};

type ServiceRow = {
  id: string;
  name: string | null;
};

type PurchaseRow = {
  id: string;
  purchase_code: string;
  purchase_date: string;
  payment_status: string;
  purchase_status: string;
  balloting_status: string;
  admin_notes: string | null;
  services: { name: string | null } | { name: string | null }[] | null;
};

function nestedName(value: PurchaseRow["services"]) {
  const service = Array.isArray(value) ? value[0] : value;
  return service?.name?.trim() || "EZ Life Service";
}

function createPurchaseCode() {
  return `PUR-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 6)
    .toUpperCase()}`;
}

function badgeClass(status: string) {
  const value = status.toLowerCase();

  if (["active", "paid", "verified", "completed"].includes(value)) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (["cancelled", "rejected", "overdue"].includes(value)) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-300";
}

export default function MemberPurchasesPage() {
  const router = useRouter();

  const [member, setMember] = useState<MemberContext | null>(null);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadPage() {
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/member/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("member_id, full_name, role, status, must_change_password")
        .eq("auth_user_id", session.user.id)
        .single();

      if (
        profileError ||
        !profile ||
        profile.role !== "member" ||
        profile.status !== "active" ||
        !profile.member_id
      ) {
        await supabase.auth.signOut();
        router.replace("/member/login");
        return;
      }

      if (profile.must_change_password) {
        router.replace("/member/change-password");
        return;
      }

      const { data: kycRows, error: kycError } = await supabase
        .from("member_kyc")
        .select("status")
        .eq("member_id", profile.member_id)
        .limit(1);

      if (kycError) {
        throw new Error(kycError.message);
      }

      if ((kycRows?.[0]?.status ?? "not_started") !== "verified") {
        toast.error("Product purchase se pehle KYC approval required hai.");
        router.replace("/member/kyc");
        return;
      }

      const [servicesResult, purchasesResult] = await Promise.all([
        supabase
          .from("services")
          .select("id, name")
          .ilike("name", "%umrah%")
          .order("name", { ascending: true }),

        supabase
          .from("purchases")
          .select(
            "id, purchase_code, purchase_date, payment_status, purchase_status, balloting_status, admin_notes, services(name)",
          )
          .eq("member_id", profile.member_id)
          .order("purchase_date", { ascending: false }),
      ]);

      if (servicesResult.error) {
        throw new Error(servicesResult.error.message);
      }

      if (purchasesResult.error) {
        throw new Error(purchasesResult.error.message);
      }

      const umrahServices = (servicesResult.data ?? []) as ServiceRow[];

      setMember({
        memberId: profile.member_id,
        fullName: profile.full_name,
      });

      setServices(umrahServices);
      setPurchases((purchasesResult.data ?? []) as PurchaseRow[]);

      if (umrahServices.length > 0) {
        setSelectedServiceId((current) => current || umrahServices[0].id);
      }
    } catch (error) {
      console.error("Purchase page load error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Purchase page load nahi ho saka.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPage();
  }, []);

  const selectedService = useMemo(
    () => services.find((item) => item.id === selectedServiceId) ?? null,
    [selectedServiceId, services],
  );

  async function submitPurchase() {
    if (!member || !selectedServiceId) {
      toast.error("Please select Umrah.");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the purchase terms.");
      return;
    }

    setIsSubmitting(true);

    try {
      const purchaseCode = createPurchaseCode();

      const { error } = await supabase.from("purchases").insert({
        member_id: member.memberId,
        service_id: selectedServiceId,
        purchase_code: purchaseCode,
        payment_status: "pending",
        purchase_status: "pending",
        balloting_status: "not_eligible",
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success(
        "Purchase request submitted. Admin approval is now required.",
      );

      setAcceptedTerms(false);
      await loadPage();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Purchase request submit nahi ho saki.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <LoaderCircle className="h-8 w-8 animate-spin text-violet-300" />
      </main>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/member/dashboard")}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            KYC Approved
          </div>

          <h1 className="mt-5 text-3xl font-black">Umrah Purchase</h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Purchase request submit karne ke baad admin approval required hoga.
            Approval ke baad payment upload ka option unlock hoga.
          </p>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-violet-300" />
              <h2 className="text-xl font-black">New Purchase Request</h2>
            </div>

            {services.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                Umrah service is not available.
              </div>
            ) : (
              <>
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`mt-6 w-full rounded-2xl border p-5 text-left ${
                      selectedServiceId === service.id
                        ? "border-violet-400/50 bg-violet-500/10"
                        : "border-slate-800 bg-slate-950"
                    }`}
                  >
                    <h3 className="text-xl font-black">
                      {service.name ?? "Umrah"}
                    </h3>

                    <p className="mt-2 leading-6 text-slate-500">
                      Admin approval ke baad payment instructions available
                      hongi.
                    </p>
                  </button>
                ))}

                <label className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) =>
                      setAcceptedTerms(event.target.checked)
                    }
                    className="mt-1 accent-violet-500"
                  />

                  <span className="text-sm leading-6 text-slate-400">
                    I understand that this request needs admin approval before
                    payment.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => void submitPurchase()}
                  disabled={isSubmitting || !selectedService || !acceptedTerms}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  Submit Purchase Request
                </button>
              </>
            )}
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <PackageCheck className="h-6 w-6 text-emerald-300" />
              <h2 className="text-xl font-black">Purchase History</h2>
            </div>

            <div className="mt-6 space-y-4">
              {purchases.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                  No purchase request submitted.
                </div>
              ) : (
                purchases.map((purchase) => (
                  <article
                    key={purchase.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-violet-300">
                          {purchase.purchase_code}
                        </p>

                        <h3 className="mt-2 text-lg font-black">
                          {nestedName(purchase.services)}
                        </h3>
                      </div>

                      <span
                        className={`self-start rounded-full border px-3 py-1 text-xs font-bold capitalize ${badgeClass(
                          purchase.purchase_status,
                        )}`}
                      >
                        {purchase.purchase_status.replaceAll("_", " ")}
                      </span>
                    </div>

                    {purchase.purchase_status === "pending" && (
                      <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
                        Waiting for admin approval.
                      </p>
                    )}

                    {purchase.purchase_status === "active" && (
                      <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">
                        Approved. Payment upload is the next step.
                      </p>
                    )}

                    {purchase.purchase_status === "cancelled" && (
                      <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
                        This purchase request was cancelled by admin.
                      </p>
                    )}

                    {purchase.admin_notes && (
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Admin note: {purchase.admin_notes}
                      </p>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
