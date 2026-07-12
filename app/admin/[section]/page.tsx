import AdminLayout from "../../../components/admin/AdminLayout";

type AdminSectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

const sectionContent: Record<
  string,
  {
    label: string;
    title: string;
    description: string;
  }
> = {
  registrations: {
    label: "Registration Management",
    title: "Customer Registrations",
    description:
      "View new registrations, selected services, referral details and application status.",
  },
  members: {
    label: "Member Management",
    title: "EZ Life Members",
    description:
      "View active, inactive and suspended members along with their membership information.",
  },
  approvals: {
    label: "Approval Queue",
    title: "Pending Approvals",
    description:
      "Review registrations, documents, KYC information and pending membership approvals.",
  },
  payments: {
    label: "Finance Management",
    title: "Payments & Installments",
    description:
      "Manage monthly installments, receipts, pending payments and member payment history.",
  },
  kyc: {
    label: "KYC Management",
    title: "Identity Verification",
    description:
      "Review member identity documents, verification status and rejected KYC submissions.",
  },
  balloting: {
    label: "Balloting Management",
    title: "Balloting System",
    description:
      "Manage eligible members, upcoming ballots, selections and balloting results.",
  },
  reports: {
    label: "Reports & Analytics",
    title: "Business Reports",
    description:
      "View membership, payment, referral, balloting and service performance reports.",
  },
  notifications: {
    label: "Communication Center",
    title: "Notifications",
    description:
      "Send payment reminders, approval updates, announcements and balloting notifications.",
  },
  documents: {
    label: "Document Center",
    title: "Member Documents",
    description:
      "Manage uploaded documents, receipts, KYC files and membership records.",
  },
  settings: {
    label: "System Configuration",
    title: "Admin Settings",
    description:
      "Manage services, system preferences, notifications and application configuration.",
  },
  profile: {
    label: "Administrator",
    title: "Admin Profile",
    description:
      "Manage administrator information, security preferences and account access.",
  },
};

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  const { section } = await params;

  const content = sectionContent[section] ?? {
    label: "Administration",
    title: "Admin Section",
    description:
      "This administration module is ready for future functionality and Supabase data integration.",
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#172B63]/70 via-[#111C35] to-[#6D3BFF]/35 p-8">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#8C5CFF]/25 blur-3xl"
          />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              {content.label}
            </p>

            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              {content.title}
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-slate-300">
              {content.description}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-black text-white">
            Module Ready
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            Is module ka frontend route operational hai. Agle phase mein yahan
            Supabase se live data, filters, search, approvals aur management
            actions connect ki jayengi.
          </p>
        </section>
      </div>
    </AdminLayout>
  );
}