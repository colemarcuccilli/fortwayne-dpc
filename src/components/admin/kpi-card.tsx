import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning";
  className?: string;
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 lg:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              tone === "success"
                ? "bg-emerald-100 text-emerald-700"
                : tone === "warning"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600",
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tabular-nums text-slate-900 lg:text-3xl">
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-xs text-slate-500">{hint}</div>
      )}
    </div>
  );
}
