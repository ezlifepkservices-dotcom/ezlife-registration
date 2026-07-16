import {
  CheckCircle2,
  CircleDashed,
  FileCheck2,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Trophy,
} from "lucide-react";

export type JourneyStepStatus =
  | "complete"
  | "current"
  | "pending"
  | "rejected";

export type JourneyStep = {
  label: string;
  detail: string;
  status: JourneyStepStatus;
  href?: string;
  clickable?: boolean;
};

type Props = {
  steps: JourneyStep[];
  onStepClick?: (step: JourneyStep) => void;
};

const icons = [
  FileCheck2,
  FileCheck2,
  ShoppingBag,
  ReceiptText,
  Trophy,
];

function statusClasses(status: JourneyStepStatus) {
  if (status === "complete") {
    return [
      "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      "Complete",
    ];
  }

  if (status === "current") {
    return [
      "border-violet-400/30 bg-violet-400/15 text-violet-300",
      "border-violet-400/20 bg-violet-400/10 text-violet-300",
      "Current Step",
    ];
  }

  if (status === "rejected") {
    return [
      "border-rose-400/30 bg-rose-400/15 text-rose-300",
      "border-rose-400/20 bg-rose-400/10 text-rose-300",
      "Action Required",
    ];
  }

  return [
    "border-white/10 bg-white/[0.035] text-slate-600",
    "border-white/10 bg-white/[0.03] text-slate-500",
    "Pending",
  ];
}

function actionText(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("kyc")) return "Open KYC →";
  if (normalized.includes("purchase")) return "Open Purchase →";
  if (normalized.includes("payment")) return "Open Payment →";
  if (normalized.includes("balloting")) return "Open Balloting →";

  return "Open →";
}

export default function JourneyStatusCard({
  steps,
  onStepClick,
}: Props) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">
        <Sparkles className="h-4 w-4" />
        Member Journey
      </div>

      <h2 className="mt-4 text-2xl font-black sm:text-3xl">
        Your progress with EZ Life
      </h2>

      <p className="mt-3 max-w-2xl leading-7 text-slate-400">
        Complete each step to activate your purchase and become eligible for
        product-specific balloting.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = icons[index] ?? CircleDashed;
          const [circle, badge, label] = statusClasses(step.status);
          const clickable = Boolean(step.clickable && step.href);

          return (
            <button
              key={step.label}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(step)}
              className={`rounded-3xl border p-5 text-left transition ${
                clickable
                  ? "cursor-pointer border-violet-400/30 bg-slate-950/60 hover:-translate-y-0.5 hover:border-violet-400/60 hover:bg-slate-900"
                  : "cursor-default border-white/10 bg-slate-950/40"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${circle}`}
              >
                {step.status === "complete" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              <span
                className={`mt-5 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badge}`}
              >
                {label}
              </span>

              <h3 className="mt-3 font-bold text-white">{step.label}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step.detail}
              </p>

              {clickable && (
                <p className="mt-4 text-xs font-bold text-violet-300">
                  {actionText(step.label)}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
