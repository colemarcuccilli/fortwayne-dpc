"use client";

import { useMemo } from "react";
import { parseISO, startOfMonth, subMonths, isSameMonth, format } from "date-fns";
import {
  Building2,
  CircleDollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { KpiCard } from "@/components/admin/kpi-card";
import { useAdmin } from "@/lib/admin/store";
import { formatMoney } from "@/lib/admin/format";
import { MEMBERSHIP_TIER_LABEL, TXN_KIND_LABEL } from "@/lib/admin/types";

export default function ReportsPage() {
  const { state } = useAdmin();

  const months = useMemo(() => {
    const arr: { label: string; date: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(startOfMonth(new Date()), i);
      arr.push({ label: format(d, "MMM"), date: d });
    }
    return arr;
  }, []);

  const revenueByMonth = months.map((m) => {
    const total = state.transactions
      .filter(
        (t) =>
          t.kind !== "refund" && isSameMonth(parseISO(t.occurredAt), m.date),
      )
      .reduce((s, t) => s + t.amount, 0);
    return { ...m, total };
  });

  const maxMonth = Math.max(...revenueByMonth.map((r) => r.total), 1);

  const membershipCounts = useMemo(() => {
    const map: Record<string, number> = {};
    state.customers.forEach((c) => {
      map[c.membership] = (map[c.membership] ?? 0) + 1;
    });
    return map;
  }, [state.customers]);

  const kindCounts = useMemo(() => {
    const map: Record<string, { count: number; amount: number }> = {};
    state.transactions.forEach((t) => {
      if (!map[t.kind]) map[t.kind] = { count: 0, amount: 0 };
      map[t.kind].count += 1;
      map[t.kind].amount += t.amount;
    });
    return map;
  }, [state.transactions]);

  const pipelineOpenCount = state.prospects.filter(
    (p) => p.stage !== "won" && p.stage !== "lost",
  ).length;
  const pipelineWonCount = state.prospects.filter(
    (p) => p.stage === "won",
  ).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        subtitle="Practice performance at a glance. Members, revenue, pipeline."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Members"
          value={String(
            state.customers.filter((c) => c.membership !== "none").length,
          )}
          hint="active memberships"
          icon={Users}
        />
        <KpiCard
          label="This month"
          value={formatMoney(revenueByMonth.at(-1)!.total)}
          hint="revenue collected"
          icon={CircleDollarSign}
          tone="success"
        />
        <KpiCard
          label="Pipeline open"
          value={String(pipelineOpenCount)}
          hint="active prospects"
          icon={TrendingUp}
        />
        <KpiCard
          label="Pipeline won"
          value={String(pipelineWonCount)}
          hint="employers signed"
          icon={Building2}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Monthly revenue (last 6)
        </h2>
        <div className="mt-4 flex items-end gap-2 h-40">
          {revenueByMonth.map((m) => (
            <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-md bg-slate-900"
                style={{
                  height: `${Math.max((m.total / maxMonth) * 100, 4)}%`,
                }}
                title={formatMoney(m.total)}
              />
              <div className="text-[10px] font-semibold text-slate-500">
                {m.label}
              </div>
              <div className="font-mono text-[10px] tabular-nums text-slate-700">
                {m.total > 0 ? formatMoney(m.total) : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Members by tier
          </h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(membershipCounts).map(([tier, count]) => (
              <li key={tier} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">
                  {MEMBERSHIP_TIER_LABEL[tier as keyof typeof MEMBERSHIP_TIER_LABEL]}
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Revenue by kind
          </h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(kindCounts).map(([kind, data]) => (
              <li key={kind}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-700">
                    {TXN_KIND_LABEL[kind as keyof typeof TXN_KIND_LABEL]}
                  </span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatMoney(data.amount)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {data.count} transactions
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
