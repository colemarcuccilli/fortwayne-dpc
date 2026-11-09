"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, Search, ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/admin/store";
import { formatDateTime, initials, timeAgo } from "@/lib/admin/format";

export default function PatientFormsPage() {
  const { state } = useAdmin();
  const [query, setQuery] = useState("");

  const forms = useMemo(() => {
    const list = state.submissions.filter(
      (s) => s.type === "patient" && !s.archived,
    );
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q),
    );
  }, [state.submissions, query]);

  const unread = state.submissions.filter(
    (s) => s.type === "patient" && !s.read && !s.archived,
  ).length;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Patient Forms"
        subtitle="New-patient intake forms submitted from the website. Open one to view the full answers or download it."
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search patients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-44 pl-9 sm:w-64"
            />
          </div>
        }
      />

      {unread > 0 && (
        <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-2.5 text-sm text-slate-700">
          <strong>{unread}</strong> new intake form{unread === 1 ? "" : "s"} to review.
        </div>
      )}

      {forms.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={query ? "No matches" : "No patient forms yet"}
          body={
            query
              ? "Try a different search."
              : "Completed intake forms from the website will appear here."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {forms.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/patient-forms/${s.id}`}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-slate-50"
                >
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                    {initials(s.name)}
                    {!s.read && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={
                        s.read
                          ? "truncate text-sm font-medium text-slate-800"
                          : "truncate text-sm font-semibold text-slate-900"
                      }
                    >
                      {s.name}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {[s.email, s.phone].filter(Boolean).join(" · ") || "No contact info"}
                    </div>
                  </div>
                  <div className="hidden text-right text-xs text-slate-400 sm:block">
                    <div>{formatDateTime(s.createdAt)}</div>
                    <div>{timeAgo(s.createdAt)}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
