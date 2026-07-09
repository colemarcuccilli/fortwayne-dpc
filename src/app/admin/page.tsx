"use client";

import {
  addDays,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
} from "date-fns";
import {
  Calendar,
  CircleDollarSign,
  Inbox as InboxIcon,
  TrendingUp,
  Users as UsersIcon,
  ArrowRight,
} from "lucide-react";
import { useAdmin } from "@/lib/admin/store";
import { formatMoney, formatDate, formatTime, timeAgo } from "@/lib/admin/format";
import { APPT_TYPE_LABEL } from "@/lib/admin/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { KpiCard } from "@/components/admin/kpi-card";
import { EmptyState } from "@/components/admin/empty-state";
import { StageBadge } from "@/components/admin/stage-badge";
import { AdminButton } from "@/components/admin/admin-button";

export default function AdminDashboardPage() {
  const { state } = useAdmin();

  const now = new Date();
  const startToday = startOfDay(now);
  const nextWeek = addDays(now, 7);

  // KPIs
  const mrr = state.customers
    .filter((c) => c.membership !== "none")
    .reduce((sum, c) => {
      switch (c.membership) {
        case "platinum":
          return sum + 25000;
        case "family":
          return sum + 20000;
        case "employer":
          return sum + 7900;
        case "college":
          return sum + 5000;
        default:
          return sum + 8500;
      }
    }, 0);

  const upcomingAppts = state.appointments
    .filter((a) => {
      const start = parseISO(a.startsAt);
      return isAfter(start, now) && a.status === "scheduled";
    })
    .sort(
      (a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
    );

  const upcomingWeekCount = upcomingAppts.filter((a) =>
    isBefore(parseISO(a.startsAt), nextWeek),
  ).length;

  const pipelineValue = state.prospects
    .filter((p) => p.stage !== "won" && p.stage !== "lost")
    .reduce((sum, p) => sum + (p.estValueUsd ?? 0) * 100, 0);

  const unreadCount = state.submissions.filter(
    (s) => !s.read && !s.archived,
  ).length;

  const openTasks = state.tasks.filter((t) => !t.done);
  const todaysAppts = upcomingAppts.filter((a) =>
    isSameDay(parseISO(a.startsAt), now),
  );

  const stageCounts: Record<string, number> = {};
  state.prospects.forEach((p) => {
    stageCounts[p.stage] = (stageCounts[p.stage] ?? 0) + 1;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Good ${greetingFor(now)}, Cole.`}
        subtitle={`Today is ${formatDate(now.toISOString(), "EEEE, MMM d, yyyy")}.`}
        actions={
          <>
            <AdminButton href="/admin/appointments" variant="outline">
              <Calendar className="h-4 w-4" />
              Appointments
            </AdminButton>
            <AdminButton href="/admin/pipeline" variant="solid">
              <TrendingUp className="h-4 w-4" />
              Pipeline
            </AdminButton>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KpiCard
          label="MRR"
          value={formatMoney(mrr)}
          hint={`${state.customers.filter((c) => c.membership !== "none").length} active members`}
          icon={CircleDollarSign}
          tone="success"
        />
        <KpiCard
          label="Appts / next 7d"
          value={String(upcomingWeekCount)}
          hint={
            todaysAppts.length > 0
              ? `${todaysAppts.length} today`
              : "None today"
          }
          icon={Calendar}
        />
        <KpiCard
          label="Pipeline value"
          value={formatMoney(pipelineValue)}
          hint={`${state.prospects.filter((p) => p.stage !== "won" && p.stage !== "lost").length} active prospects`}
          icon={TrendingUp}
        />
        <KpiCard
          label="Unread inbox"
          value={String(unreadCount)}
          hint={`${state.submissions.length} total submissions`}
          icon={InboxIcon}
          tone={unreadCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Upcoming appointments
              </h2>
              <p className="text-xs text-slate-500">Next up on the calendar.</p>
            </div>
            <AdminButton href="/admin/appointments" variant="ghost" size="sm">
              See all
              <ArrowRight className="h-3.5 w-3.5" />
            </AdminButton>
          </div>
          {upcomingAppts.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No upcoming appointments"
              body="Schedule one from the Appointments page."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcomingAppts.slice(0, 5).map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-center leading-none">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {formatDate(a.startsAt, "MMM")}
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-900">
                      {formatDate(a.startsAt, "d")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {a.customerName}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span>{APPT_TYPE_LABEL[a.type]}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">
                        {formatTime(a.startsAt)}
                      </span>
                      {a.location === "virtual" && (
                        <>
                          <span>·</span>
                          <span>Virtual</span>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent inbox */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Inbox</h2>
              <p className="text-xs text-slate-500">Latest form submissions.</p>
            </div>
            <AdminButton href="/admin/inbox" variant="ghost" size="sm">
              Open
              <ArrowRight className="h-3.5 w-3.5" />
            </AdminButton>
          </div>
          {state.submissions.length === 0 ? (
            <EmptyState icon={InboxIcon} title="Inbox is empty" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {state.submissions.slice(0, 4).map((s) => (
                <li key={s.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400 data-[unread=true]:bg-brand" data-unread={!s.read} />
                    <span className="text-xs font-mono font-semibold uppercase tracking-[0.08em] text-slate-500">
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
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Pipeline snapshot */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Pipeline snapshot
              </h2>
              <p className="text-xs text-slate-500">
                Employer prospects by stage.
              </p>
            </div>
            <AdminButton href="/admin/pipeline" variant="ghost" size="sm">
              Open pipeline
              <ArrowRight className="h-3.5 w-3.5" />
            </AdminButton>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {(
              [
                "researched",
                "to_contact",
                "contacted",
                "meeting_booked",
                "proposal_sent",
                "won",
                "lost",
              ] as const
            ).map((stage) => (
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

        {/* Tasks */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Tasks</h2>
              <p className="text-xs text-slate-500">
                {openTasks.length} open
              </p>
            </div>
            <AdminButton href="/admin/tasks" variant="ghost" size="sm">
              Manage
              <ArrowRight className="h-3.5 w-3.5" />
            </AdminButton>
          </div>
          {openTasks.length === 0 ? (
            <EmptyState title="All caught up" />
          ) : (
            <ul className="space-y-2.5">
              {openTasks.slice(0, 4).map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-900">
                        {t.title}
                      </div>
                      {t.dueAt && (
                        <div className="text-[11px] text-slate-500">
                          Due {formatDate(t.dueAt)}
                        </div>
                      )}
                    </div>
                    <span
                      className={
                        t.priority === "high"
                          ? "rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-700"
                          : t.priority === "medium"
                            ? "rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700"
                            : "rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-700"
                      }
                    >
                      {t.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
