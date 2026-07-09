import { cn } from "@/lib/utils";
import { PIPELINE_STAGE_LABEL, type PipelineStage } from "@/lib/admin/types";

const TONE: Record<PipelineStage, string> = {
  researched: "bg-slate-100 text-slate-700",
  to_contact: "bg-blue-100 text-blue-700",
  contacted: "bg-indigo-100 text-indigo-700",
  meeting_booked: "bg-violet-100 text-violet-700",
  proposal_sent: "bg-amber-100 text-amber-800",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
};

export function StageBadge({ stage }: { stage: PipelineStage }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]",
        TONE[stage],
      )}
    >
      {PIPELINE_STAGE_LABEL[stage]}
    </span>
  );
}
