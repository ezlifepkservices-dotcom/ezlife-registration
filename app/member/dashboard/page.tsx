"use client";

import { ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import DashboardStats from "../../../components/member/DashboardStats";
import InterestedServicesCard from "../../../components/member/InterestedServicesCard";
import JourneyStatusCard, {
  type JourneyStep,
} from "../../../components/member/JourneyStatusCard";
import MemberHeader from "../../../components/member/MemberHeader";
import MemberProfileCard from "../../../components/member/MemberProfileCard";
import MemberSidebar from "../../../components/member/MemberSidebar";
import NextActionCard from "../../../components/member/NextActionCard";
import PurchasesCard, {
  type MemberPurchase,
} from "../../../components/member/PurchasesCard";
import { supabase } from "../../../lib/supabase";

type MemberProfile = {
  full_name: string;
  email: string;
  role: string;
  status: string;
  member_id: string | null;
  must_change_password: boolean;
};

type MemberRecord = {
  id: string;
  full_name: string;
  email: string;
  referral_code: string;
  status: string;
};

type RegistrationRecord = {
  status: string;
  interested_service: string | null;
};

type KycRecord = {
  status: string;
};

type PurchaseRow = {
  id: string;
  purchase_code: string;
  payment_status: string;
  purchase_status: string;
  balloting_status: string;
  services:
    | { name: string }
    | { name: string }[]
    | null;
};

type DashboardData = {
  profile: MemberProfile;
  member: MemberRecord;
  registration: RegistrationRecord | null;
  kycStatus: string;
  purchases: MemberPurchase[];
  directReferrals: number;
};

function normalizeServiceName(
  services: PurchaseRow["services"],
): string {
  if (Array.isArray(services)) {
    return services[0]?.name ?? "Service";
  }

  return services?.name ?? "Service";
}

export default function MemberDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
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
          .select(
            "full_name, email, role, status, member_id, must_change_password",
          )
          .eq("auth_user_id", session.user.id)
          .single<MemberProfile>();

        if (profileError || !profileData) {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (profileData.role !== "member") {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (profileData.status === "suspended") {
          router.replace("/member/suspended");
          return;
        }

        if (profileData.status !== "active" || !profileData.member_id) {
          await supabase.auth.signOut();
          router.replace("/member/login");
          return;
        }

        if (profileData.must_change_password) {
          router.replace("/member/change-password");
          return;
        }

        const [
          memberResult,
          registrationResult,
          kycResult,
          purchaseResult,
        ] = await Promise.all([
          supabase
            .from("members")
            .select("id, full_name, email, referral_code, status")
            .eq("id", profileData.member_id)
            .single<MemberRecord>(),

          supabase
            .from("registrations")
            .select("status, interested_service")
            .ilike("email", profileData.email.trim().toLowerCase())
            .order("created_at", { ascending: false })
            .limit(1),

          supabase
            .from("member_kyc")
            .select("status")
            .eq("member_id", profileData.member_id)
            .limit(1),

          supabase
            .from("purchases")
            .select(
              "id, purchase_code, payment_status, purchase_status, balloting_status, services(name)",
            )
            .eq("member_id", profileData.member_id)
            .order("purchase_date", { ascending: false }),
        ]);

        if (memberResult.error || !memberResult.data) {
          throw new Error(
            memberResult.error?.message ?? "Member record was not found.",
          );
        }

        if (registrationResult.error) {
          throw new Error(registrationResult.error.message);
        }

        if (kycResult.error) {
          throw new Error(kycResult.error.message);
        }

        if (purchaseResult.error) {
          throw new Error(purchaseResult.error.message);
        }

        const registration =
          (registrationResult.data?.[0] as RegistrationRecord | undefined) ??
          null;

        const kyc =
          (kycResult.data?.[0] as KycRecord | undefined) ?? null;

        const { count: directReferrals, error: referralCountError } =
          await supabase
            .from("registrations")
            .select("id", { count: "exact", head: true })
            .eq("referred_by", memberResult.data.referral_code)
            .ilike("status", "approved");

        if (referralCountError) {
          throw new Error(referralCountError.message);
        }

        const purchases = ((purchaseResult.data ?? []) as PurchaseRow[]).map(
          (purchase) => ({
            id: purchase.id,
            purchaseCode: purchase.purchase_code,
            serviceName: normalizeServiceName(purchase.services),
            paymentStatus: purchase.payment_status,
            purchaseStatus: purchase.purchase_status,
            ballotingStatus: purchase.balloting_status,
          }),
        );

        if (isMounted) {
          setData({
            profile: profileData,
            member: memberResult.data,
            registration,
            kycStatus: kyc?.status ?? "not_started",
            purchases,
            directReferrals: directReferrals ?? 0,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Member dashboard error:", error);

        if (isMounted) {
          setIsLoading(false);
        }

        toast.error(
          error instanceof Error
            ? error.message
            : "Member dashboard load nahi ho saka.",
        );
      }
    }

    void loadDashboard();

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

  const interestedServices = useMemo(() => {
    const raw = data?.registration?.interested_service ?? "";

    return raw
      .split(",")
      .map((service) => service.trim())
      .filter(Boolean);
  }, [data]);

  const eligiblePurchases = useMemo(
    () =>
      data?.purchases.filter((purchase) =>
        ["eligible", "entered"].includes(
          purchase.ballotingStatus.toLowerCase(),
        ),
      ).length ?? 0,
    [data],
  );

  const journeySteps = useMemo<JourneyStep[]>(() => {
    if (!data) {
      return [];
    }

    const registrationApproved =
      data.registration?.status.toLowerCase() === "approved";
    const kycVerified = data.kycStatus === "verified";
    const kycRejected = data.kycStatus === "rejected";
    const hasPurchase = data.purchases.length > 0;
    const hasVerifiedPayment = data.purchases.some((purchase) =>
      ["paid", "partial"].includes(purchase.paymentStatus.toLowerCase()),
    );
    const hasBallotReadyPurchase = data.purchases.some((purchase) =>
      ["eligible", "entered", "winner", "consumed"].includes(
        purchase.ballotingStatus.toLowerCase(),
      ),
    );

    return [
      {
        label: "Registration",
        detail: registrationApproved
          ? "Your registration has been approved."
          : "Registration approval is pending.",
        status: registrationApproved ? "complete" : "current",
      },
      {
        label: "KYC",
        detail: kycVerified
          ? "Your identity has been verified."
          : kycRejected
            ? "Your KYC needs correction."
            : "Complete and submit your KYC.",
        status: kycVerified
          ? "complete"
          : kycRejected
            ? "rejected"
            : "current",
      },
      {
        label: "Purchase",
        detail: hasPurchase
          ? "Your confirmed purchase is available."
          : "Select a product after KYC verification.",
        status: hasPurchase
          ? "complete"
          : kycVerified
            ? "current"
            : "pending",
      },
      {
        label: "Payment",
        detail: hasVerifiedPayment
          ? "Payment has been recorded."
          : "Upload payment proof for verification.",
        status: hasVerifiedPayment
          ? "complete"
          : hasPurchase
            ? "current"
            : "pending",
      },
      {
        label: "Balloting",
        detail: hasBallotReadyPurchase
          ? "At least one purchase is ready for balloting."
          : "Admin will decide product-wise eligibility.",
        status: hasBallotReadyPurchase
          ? "complete"
          : hasVerifiedPayment
            ? "current"
            : "pending",
      },
    ];
  }, [data]);

  const nextAction = useMemo(() => {
    if (!data) {
      return {
        title: "Loading",
        description: "Please wait.",
        actionLabel: "Continue",
      };
    }

    if (data.kycStatus === "rejected") {
      return {
        title: "Correct and resubmit your KYC",
        description:
          "Admin ne KYC mein correction maangi hai. KYC module complete hone ke baad aap documents update kar sakenge.",
        actionLabel: "Update KYC",
      };
    }

    if (data.kycStatus !== "verified") {
      return {
        title: "Complete your KYC",
        description:
          "Product purchase aur payment process start karne se pehle identity verification complete karein.",
        actionLabel: "Start KYC",
      };
    }

    if (data.purchases.length === 0) {
      return {
        title: "Select a product",
        description:
          "KYC verified hai. Ab interested service ke liye product request aur payment upload karein.",
        actionLabel: "Choose Product",
      };
    }

    const pendingPayment = data.purchases.some((purchase) =>
      ["pending", "partial", "overdue"].includes(
        purchase.paymentStatus.toLowerCase(),
      ),
    );

    if (pendingPayment) {
      return {
        title: "Complete payment verification",
        description:
          "Payment proof submit karein ya admin verification ka wait karein.",
        actionLabel: "View Payments",
      };
    }

    if (eligiblePurchases === 0) {
      return {
        title: "Wait for balloting eligibility",
        description:
          "Payment recorded hai. Admin product-specific balloting eligibility review karega.",
        actionLabel: "View Purchase",
      };
    }

    return {
      title: "You are ready for balloting",
      description:
        "Eligible purchase next product-specific ballot mein enter ho sakti hai.",
      actionLabel: "View Balloting",
    };
  }, [data, eligiblePurchases]);

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
            Please wait while your member journey is being loaded.
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const firstName = data.profile.full_name.split(" ")[0] || "Member";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <MemberSidebar
          isSigningOut={isSigningOut}
          onSignOut={handleSignOut}
        />

        <section className="min-w-0 flex-1">
          <MemberHeader
            firstName={firstName}
            isSigningOut={isSigningOut}
            onSignOut={handleSignOut}
          />

          <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 p-6 sm:p-8">
              <div className="absolute -right-20 -top-24 hidden h-72 w-72 rounded-full bg-violet-500/15 blur-3xl sm:block" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  Account Active
                </div>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  Your EZ Life journey starts here.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  Registration sirf interest record karti hai. KYC, product
                  selection, payment verification aur product-wise balloting
                  ka progress yahan nazar aayega.
                </p>
              </div>
            </section>

            <JourneyStatusCard steps={journeySteps} />

            <DashboardStats
              directReferrals={data.directReferrals}
              totalPurchases={data.purchases.length}
              eligiblePurchases={eligiblePurchases}
              kycStatus={data.kycStatus}
            />

            <section className="grid gap-6 xl:grid-cols-3">
              <PurchasesCard purchases={data.purchases} />

              <NextActionCard
                title={nextAction.title}
                description={nextAction.description}
                actionLabel={nextAction.actionLabel}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <InterestedServicesCard services={interestedServices} />

              <MemberProfileCard
                fullName={data.member.full_name}
                email={data.member.email}
                memberId={data.member.id}
                referralCode={data.member.referral_code}
                status={data.member.status}
              />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
