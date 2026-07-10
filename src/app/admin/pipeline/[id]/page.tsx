"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Globe,
  MapPin,
  Mail,
  Phone,
  Trash2,
  Users,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StageBadge } from "@/components/admin/stage-badge";
import { AdminButton } from "@/components/admin/admin-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/lib/admin/store";
import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABEL,
  type PipelineStage,
  type ProspectActivity,
} from "@/lib/admin/types";
import { formatDate, formatMoney, timeAgo } from "@/lib/admin/format";

export default function ProspectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch } = useAdmin();
  const prospect = state.prospects.find((p) => p.id === params.id);

  const [noteType, setNoteType] = useState<ProspectActivity["type"]>("note");
  const [noteBody, setNoteBody] = useState("");

  if (!prospect) {
    return (
      <div className="space-y-4">
        <AdminButton href="/admin/pipeline" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" /> Back to pipeline
        </AdminButton>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">Prospect not found.</p>
        </div>
      </div>
    );
  }

  function updateStage(stage: PipelineStage) {
    if (!prospect) return;
    dispatch({ type: "prospect_update", id: prospect.id, patch: { stage } });
    dispatch({
      type: "prospect_add_activity",
      id: prospect.id,
      activity: {
        type: "stage_change",
        body: `Moved to ${PIPELINE_STAGE_LABEL[stage]}`,
      },
    });
  }

  function logActivity(e: React.FormEvent) {
    e.preventDefault();
    if (!prospect || !noteBody.trim()) return;
    dispatch({
      type: "prospect_add_activity",
      id: prospect.id,
      activity: { type: noteType, body: noteBody.trim() },
    });
    setNoteBody("");
  }

  function deleteProspect() {
    if (!prospect) return;
    if (!confirm(`Delete ${prospect.company}? This can't be undone.`)) return;
    dispatch({ type: "prospect_delete", id: prospect.id });
    router.push("/admin/pipeline");
  }

  return (
    <div className="space-y-6">
      <AdminButton href="/admin/pipeline" variant="ghost" size="sm">
        <ArrowLeft className="h-4 w-4" /> Back to pipeline
      </AdminButton>

      <AdminPageHeader
        title={prospect.company}
        subtitle={[prospect.industry, prospect.location].filter(Boolean).join(" · ")}
        actions={
          <>
            <Select
              value={prospect.stage}
              onValueChange={(v) => updateStage(v as PipelineStage)}
            >
              <SelectTrigger className="h-9 w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PIPELINE_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {PIPELINE_STAGE_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={deleteProspect}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: overview + fit + tags */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <StageBadge stage={prospect.stage} />
              {prospect.fitScore != null && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  Fit {prospect.fitScore}/10
                </span>
              )}
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              {prospect.website && (
                <InfoRow icon={Globe} label="Website">
                  <Link
                    href={prospect.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-900 hover:underline"
                  >
                    {prospect.website.replace(/^https?:\/\//, "")}
                  </Link>
                </InfoRow>
              )}
              {prospect.location && (
                <InfoRow icon={MapPin} label="Location">
                  {prospect.location}
                </InfoRow>
              )}
              {prospect.employeeCount != null && (
                <InfoRow icon={Users} label="Employees">
                  {prospect.employeeCount}
                </InfoRow>
              )}
              {prospect.estValueUsd != null && (
                <InfoRow icon={Building2} label="Est. annual value">
                  {formatMoney(prospect.estValueUsd * 100)}
                </InfoRow>
              )}
            </dl>

            {prospect.fitReason && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Why they&rsquo;re a good fit
                </div>
                {prospect.fitReason}
              </div>
            )}

            {prospect.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {prospect.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Activity log */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Activity</h2>
                <p className="text-xs text-slate-500">
                  {prospect.activities.length} entries
                </p>
              </div>
            </div>

            <form onSubmit={logActivity} className="mb-5 space-y-3">
              <div className="flex gap-2">
                <Select value={noteType} onValueChange={(v) => setNoteType(v as ProspectActivity["type"])}>
                  <SelectTrigger className="h-9 w-32 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={!noteBody.trim()}>
                  Log
                </Button>
              </div>
              <Textarea
                rows={3}
                placeholder="What happened? What's next?"
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
              />
            </form>

            {prospect.activities.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              <ol className="space-y-3 border-l border-slate-200 pl-4">
                {prospect.activities.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-400" />
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono font-semibold uppercase tracking-[0.08em] text-slate-500">
                        {a.type.replace("_", " ")}
                      </span>
                      <span className="text-slate-400">{timeAgo(a.createdAt)}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-800">{a.body}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Right column: contacts + timeline */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">Contacts</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {prospect.contacts.length}
              </span>
            </div>
            {prospect.contacts.length === 0 ? (
              <p className="text-xs text-slate-500">No contacts yet.</p>
            ) : (
              <ul className="space-y-3">
                {prospect.contacts.map((c) => (
                  <li key={c.name} className="rounded-lg border border-slate-200 p-3">
                    <div className="text-sm font-semibold text-slate-900">
                      {c.name}
                    </div>
                    {c.title && (
                      <div className="text-xs text-slate-500">{c.title}</div>
                    )}
                    <div className="mt-2 space-y-1 text-xs">
                      {c.email && (
                        <a
                          href={`mailto:${c.email}`}
                          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                        >
                          <Mail className="h-3 w-3" />
                          {c.email}
                        </a>
                      )}
                      {c.phone && (
                        <a
                          href={`tel:${c.phone}`}
                          className="flex items-center gap-1.5 font-mono text-slate-700 hover:text-slate-900"
                        >
                          <Phone className="h-3 w-3" />
                          {c.phone}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {prospect.sources.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">
                Sources
              </h2>
              <ul className="space-y-1.5 text-xs">
                {prospect.sources.map((s) => (
                  <li key={s} className="break-words">
                    {/^https?:\/\//.test(s) ? (
                      <a
                        href={s}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                      >
                        {s.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-slate-700">{s}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Timeline</h2>
            <dl className="space-y-2 text-xs">
              <TimelineRow label="Added" value={formatDate(prospect.createdAt)} />
              <TimelineRow label="Updated" value={timeAgo(prospect.updatedAt)} />
              {prospect.ownerLabel && (
                <TimelineRow label="Source" value={prospect.ownerLabel} />
              )}
              {prospect.nextFollowUp && (
                <TimelineRow
                  label="Follow-up"
                  value={formatDate(prospect.nextFollowUp)}
                  icon={Calendar}
                />
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        <Icon className="h-3 w-3" />
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-800">{children}</dd>
    </div>
  );
}

function TimelineRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-1 text-slate-500">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}
