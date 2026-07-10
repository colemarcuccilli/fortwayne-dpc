"use client";

import {
  Building2,
  CheckCircle2,
  Inbox as InboxIcon,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { isAfter, isBefore, parseISO, addDays } from "date-fns";
import { useAdmin } from "@/lib/admin/store";
import { formatMoney, formatDate, timeAgo } from "@/lib/admin/format";
import { AdminPageHeader } from "@/components/admin/page-header";
import { KpiCard } from "@/components/admin/kpi-card";
import { EmptyState } from "@/components/admin/empty-state";
import { StageBadge } from "@/components/admin/stage-badge";
import { AdminButton } from "@/components/admin/admin-button";
import { PIPELINE_STAGES } from "@/lib/admin/types";

export default function AdminDashboardPage() {
  const { state } = useAdmin();
  const now = new Date();
  const soon = addDays(now, 7);

  const activeProspects = state.prospects.filter(
    (p) => p.stage !== "won" && p.stage !== "lost",
  );
  const pipelineOpenValue = activeProspects.reduce(
    (sum, p) => sum + (p.estValueUsd ?? 0) * 100,
    0,
  );
  const wonProspects = state.prospects.filter((p) => p.stage === "won");
  const wonValue = wonProspects.reduce(
    (sum, p) => sum + (p.estValueUsd ?? 0) * 100,
    0,
  );
  const unread = state.submissions.filter((s) => !s.read && !s.archived);

  const stageCounts: Record<string, number> = {};
  state.prospects.forEach((p) => {
    stageCounts[p.stage] = (stageCounts[p.stage] ?? 0) + 1;
  });

  // Follow-ups due in the next 7 days (or overdue)
  const followUps = activeProspects
    .filter((p) => p.nextFollowUp)
    .filter((p) => isBefore(parseISO(p.nextFollowUp!), soon))
    .sort(
      (a, b) =>
        parseISO(a.nextFollowUp!).getTime() -
        parseISO(b.nextFollowUp!).getTime(),
    );

  const recentSubs = state.submissions
    .filter((s) => !s.archived)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Good ${greetingFor(now)}, Cole.`}
        subtitle={`${formatDate(now.toISOString(), "EEEE, MMM d")} · Marketing CRM`}
        actions={
          <>
            <AdminButton href="/admin/inbox" variant="outline">
              <InboxIcon className="h-4 w-4" />
              Inbox
            </AdminButton>
            <AdminButton href="/admin/pipeline" variant="solid">
              <TrendingUp className="h-4 w-4" />
              Pipeline
            </AdminButton>
          </>
        }
      />

      {/* KPIs — marketing focused */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KpiCard
          label="Active prospects"
          value={String(activeProspects.length)}
          hint={`${state.prospects.length} total in pipeline`}
          icon={Building2}
        />
        <KpiCard
          label="Pipeline value"
          value={formatMoney(pipelineOpenValue)}
          hint="open opportunities"
          icon={TrendingUp}
        />
        <KpiCard
          label="Won"
          value={formatMoney(wonValue)}
          hint={`${wonProspects.length} closed`}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          label="Unread leads"
          value={String(unread.length)}
          hint={`${state.submissions.filter((s) => !s.archived).length} total`}
          icon={InboxIcon}
          tone={unread.length > 0 ? "warning" : "default"}
        />
      </div>

      {/* Pipeline snapshot */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Pipeline snapshot
            </h2>
            <p className="text-xs text-slate-500">
              Employer &amp; business prospects by stage.
            </p>
          </div>
          <AdminButton href="/admin/pipeline" variant="ghost" size="sm">
            Open pipeline
            <ArrowRight className="h-3.5 w-3.5" />
          </AdminButton>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {PIPELINE_STAGES.map((stage) => (
            <div
              key={stage}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <StageBadge stage={stage} />
              <div className="mt-2 font-mono text-xl font-semibold tabular-nums text-slate-900">
                {stageCounts[stage] ?? 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent leads */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent leads
              </h2>
              <p className="text-xs text-slate-500">
                Latest form submissions.
              </p>
            </div>
            <AdminButton href="/admin/inbox" variant="ghost" size="sm">
              Open
              <ArrowRight className="h-3.5 w-3.5" />
            </AdminButton>
          </div>
          {recentSubs.length === 0 ? (
            <EmptyState icon={InboxIcon} title="No leads yet" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentSubs.map((s) => (
                <li key={s.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    {!s.read && (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                    )}
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {s.type}
                    </span>
                    <span className="ml-auto text-[11px] text-slate-400">
                      {timeAgo(s.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-sm font-medium text-slate-900">
                    {s.name}
                  </div>
                  {s.subject && (
                    <div className="truncate text-xs text-slate-500">
                      {s.subject}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Follow-ups due */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Follow-ups due
              </h2>
              <p className="text-xs text-slate-500">
                Prospects to reach out to soon.
              </p>
            </div>
            <AdminButton href="/admin/pipeline" variant="ghost" size="sm">
              Pipeline
              <ArrowRight className="h-3.5 w-3.5" />
            </AdminButton>
          </div>
          {followUps.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="Nothing due"
              body="Set a follow-up date on a prospect to see it here."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {followUps.slice(0, 5).map((p) => {
                const overdue = isAfter(now, parseISO(p.nextFollowUp!));
                return (
                  <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-900">
                          {p.company}
                        </div>
                        <div className="text-xs text-slate-500">
                          {p.contacts[0]?.name ?? "No contact yet"}
                        </div>
                      </div>
                      <span
                        className={
                          overdue
                            ? "shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-rose-700"
                            : "shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700"
                        }
                      >
                        {overdue ? "Overdue" : formatDate(p.nextFollowUp!, "MMM d")}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Add prospect CTA */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Add a prospect
          </h3>
          <p className="text-xs text-slate-500">
            Enter a business you want to reach out to about DPC for their team.
          </p>
        </div>
        <AdminButton href="/admin/pipeline" variant="solid">
          <Plus className="h-4 w-4" />
          Open pipeline
        </AdminButton>
      </div>
    </div>
  );
}

function greetingFor(d: Date): string {
  const h = d.getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
