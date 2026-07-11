import { cn } from "@/lib/utils";
import {
  BENEFITS_STATUS_LABEL,
  BENEFITS_STATUS_SHORT,
  type BenefitsStatus,
} from "@/lib/admin/types";

const TONE: Record<BenefitsStatus, string> = {
  // "None" and "self-funded" are the strongest targets — highlight them.
  none: "bg-emerald-100 text-emerald-700",
  self_funded: "bg-emerald-100 text-emerald-700",
  fully_insured: "bg-blue-100 text-blue-700",
  unknown: "bg-slate-100 text-slate-500",
};

export function BenefitsBadge({
  status,
  short = false,
  className,
}: {
  status?: BenefitsStatus;
  short?: boolean;
  className?: string;
}) {
  const s = status ?? "unknown";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        TONE[s],
        className,
      )}
    >
      {short ? BENEFITS_STATUS_SHORT[s] : BENEFITS_STATUS_LABEL[s]}
    </span>
  );
}
