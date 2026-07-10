"use client";

import Link from "next/link";
import { BookOpen, Building2 } from "lucide-react";
import { ResearchForm } from "@/components/research/research-form";
import { useResearch } from "@/lib/admin/research-store";
import { formatDate } from "@/lib/admin/format";

export default function ResearchConsolePage() {
  const { prospects, hydrated } = useResearch();
  const recent = prospects.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Add a prospect
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Enter one company per submission. Read the{" "}
            <Link
              href="/research/instructions"
              className="inline-flex items-center gap-1 font-medium text-slate-900 underline underline-offset-2"
            >
              <BookOpen className="h-3.5 w-3.5" />
              instructions
            </Link>{" "}
            first if this is your first run.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-center">
          <div className="font-mono text-2xl font-semibold tabular-nums text-slate-900">
            {hydrated ? prospects.length : "—"}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            prospects in pipeline
          </div>
        </div>
      </div>

      <ResearchForm />

      {/* Recently added — helps the agent avoid dupes */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Building2 className="h-4 w-4" />
          Recently added
        </h2>
        {!hydrated ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nothing yet — your first prospect will show up here.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">
                    {p.company}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {[p.industry, p.employeeCount ? `${p.employeeCount} emp` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  {p.fitScore != null && (
                    <div className="text-xs font-semibold text-slate-700">
                      Fit {p.fitScore}/10
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400">
                    {formatDate(p.createdAt, "MMM d")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
