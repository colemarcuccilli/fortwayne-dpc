"use client";

import { useMemo, useState } from "react";
import { Archive, ArchiveRestore, Inbox as InboxIcon, Mail, Phone, User } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/lib/admin/store";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import type { Submission, SubmissionType } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<SubmissionType, string> = {
  contact: "bg-blue-100 text-blue-700",
  patient: "bg-emerald-100 text-emerald-700",
  employer: "bg-violet-100 text-violet-700",
};

const TYPE_LABEL: Record<SubmissionType, string> = {
  contact: "Contact",
  patient: "Patient intake",
  employer: "Employer inquiry",
};

type Filter = "all" | "unread" | SubmissionType | "archived";

export default function InboxPage() {
  const { state, dispatch } = useAdmin();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const filtered = useMemo(() => {
    return state.submissions.filter((s) => {
      if (filter === "archived") return s.archived;
      if (s.archived) return false;
      if (filter === "unread") return !s.read;
      if (filter === "all") return true;
      return s.type === filter;
    });
  }, [state.submissions, filter]);

  function openSubmission(s: Submission) {
    setSelected(s);
    if (!s.read)
      dispatch({ type: "submission_mark_read", id: s.id, read: true });
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Inbox"
        subtitle="All form submissions from the public site — contact form, new-patient intake, employer inquiries."
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="w-full flex-wrap gap-1 sm:w-auto">
          <TabsTrigger value="all">
            All
            <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0 font-mono text-[10px]">
              {state.submissions.filter((s) => !s.archived).length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0 font-mono text-[10px]">
              {state.submissions.filter((s) => !s.read && !s.archived).length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="employer">Employer</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* List */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={InboxIcon} title="Nothing here" />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => openSubmission(s)}
                    className={cn(
                      "block w-full px-4 py-3.5 text-left transition-colors",
                      selected?.id === s.id
                        ? "bg-slate-100"
                        : "hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {!s.read && (
                          <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-brand" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
                                TYPE_COLORS[s.type],
                              )}
                            >
                              {TYPE_LABEL[s.type]}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {timeAgo(s.createdAt)}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "mt-1 truncate text-sm",
                              s.read
                                ? "font-medium text-slate-700"
                                : "font-semibold text-slate-900",
                            )}
                          >
                            {s.name}
                          </div>
                          {s.subject && (
                            <div className="truncate text-xs text-slate-500">
                              {s.subject}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
                    TYPE_COLORS[selected.type],
                  )}
                >
                  {TYPE_LABEL[selected.type]}
                </span>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                  {selected.name}
                </h2>
                {selected.subject && (
                  <p className="mt-1 text-sm text-slate-600">{selected.subject}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Received {formatDateTime(selected.createdAt)}
                </p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch({
                      type: "submission_mark_read",
                      id: selected.id,
                      read: !selected.read,
                    });
                    setSelected({ ...selected, read: !selected.read });
                  }}
                >
                  {selected.read ? "Mark unread" : "Mark read"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch({ type: "submission_archive", id: selected.id });
                    setSelected({ ...selected, archived: !selected.archived });
                  }}
                >
                  {selected.archived ? (
                    <ArchiveRestore className="h-4 w-4" />
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-slate-50 p-3">
              {selected.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-slate-800 hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <a
                    href={`tel:${selected.phone}`}
                    className="font-mono text-slate-800 hover:underline"
                  >
                    {selected.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-800">{selected.name}</span>
              </div>
            </div>

            {selected.message && (
              <div className="mt-4">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Message
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">
                  {selected.message}
                </p>
              </div>
            )}

            {selected.meta && Object.keys(selected.meta).length > 0 && (
              <div className="mt-4">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Additional info
                </div>
                <dl className="grid gap-1 text-xs">
                  {Object.entries(selected.meta).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-100 py-1">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="font-mono text-slate-800">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <EmptyState
              icon={InboxIcon}
              title="Nothing selected"
              body="Pick a submission on the left to see the full message."
            />
          </div>
        )}
      </div>
    </div>
  );
}
