"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Building2, Plus, LayoutGrid, ArrowUpRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdmin } from "@/lib/admin/store";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABEL, type PipelineStage, type Prospect } from "@/lib/admin/types";
import { StageBadge } from "@/components/admin/stage-badge";
import { formatMoney, initials, timeAgo } from "@/lib/admin/format";
import { ProspectForm } from "@/components/admin/prospect-form";
import { cn } from "@/lib/utils";

export default function PipelinePage() {
  const { state, dispatch } = useAdmin();
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addStage, setAddStage] = useState<PipelineStage>("researched");

  const filtered = useMemo(() => {
    if (!query.trim()) return state.prospects;
    const q = query.toLowerCase();
    return state.prospects.filter(
      (p) =>
        p.company.toLowerCase().includes(q) ||
        p.industry?.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.contacts.some((c) => c.name.toLowerCase().includes(q)),
    );
  }, [state.prospects, query]);

  const byStage = useMemo(() => {
    const map: Record<PipelineStage, Prospect[]> = {
      researched: [],
      to_contact: [],
      contacted: [],
      meeting_booked: [],
      proposal_sent: [],
      won: [],
      lost: [],
    };
    filtered.forEach((p) => map[p.stage].push(p));
    return map;
  }, [filtered]);

  const [draggingId, setDraggingId] = useState<string | null>(null);

  function handleDrop(stage: PipelineStage) {
    if (!draggingId) return;
    dispatch({
      type: "prospect_update",
      id: draggingId,
      patch: { stage },
    });
    dispatch({
      type: "prospect_add_activity",
      id: draggingId,
      activity: {
        type: "stage_change",
        body: `Moved to ${PIPELINE_STAGE_LABEL[stage]}`,
      },
    });
    setDraggingId(null);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Pipeline"
        subtitle="Employer & business prospects — drag cards between columns as you work them."
        actions={
          <>
            <Input
              type="search"
              placeholder="Search prospects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-40 sm:w-64"
            />
            <Button
              onClick={() => {
                setAddStage("researched");
                setAddOpen(true);
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add prospect
            </Button>
          </>
        }
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title={query ? "No matches" : "Pipeline is empty"}
          body={
            query
              ? "Try a different search term."
              : "Start by adding a researched employer."
          }
          action={
            !query ? (
              <Button
                onClick={() => {
                  setAddStage("researched");
                  setAddOpen(true);
                }}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add prospect
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="-mx-4 overflow-x-auto pb-3 lg:mx-0">
          <div className="flex gap-3 px-4 lg:px-0" style={{ minWidth: "980px" }}>
            {PIPELINE_STAGES.map((stage) => (
              <div
                key={stage}
                className={cn(
                  "w-64 shrink-0 rounded-2xl border border-slate-200 bg-slate-100/60 p-2.5",
                  draggingId && "transition-colors",
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stage)}
              >
                <div className="mb-2 flex items-center justify-between px-1.5">
                  <StageBadge stage={stage} />
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {byStage[stage].length}
                  </span>
                </div>

                <div className="space-y-2">
                  {byStage[stage].map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/pipeline/${p.id}`}
                      draggable
                      onDragStart={() => setDraggingId(p.id)}
                      onDragEnd={() => setDraggingId(null)}
                      className={cn(
                        "block rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md",
                        draggingId === p.id && "opacity-50",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-slate-900">
                            {p.company}
                          </div>
                          {p.industry && (
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {p.industry}
                              {p.employeeCount ? ` · ${p.employeeCount} emp` : ""}
                            </div>
                          )}
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      </div>

                      {p.fitReason && (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                          {p.fitReason}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        {p.contacts[0] ? (
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[9px] font-semibold text-slate-700">
                              {initials(p.contacts[0].name)}
                            </div>
                            <span className="text-[11px] text-slate-600">
                              {p.contacts[0].name.split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            No contact yet
                          </span>
                        )}
                        {p.estValueUsd ? (
                          <span className="font-mono text-[11px] font-semibold tabular-nums text-slate-700">
                            {formatMoney(p.estValueUsd * 100)}
                          </span>
                        ) : null}
                      </div>

                      {p.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="inline-flex rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 text-[10px] text-slate-400">
                        Updated {timeAgo(p.updatedAt)}
                      </div>
                    </Link>
                  ))}

                  {byStage[stage].length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-transparent px-2 py-4 text-center">
                      <button
                        onClick={() => {
                          setAddStage(stage);
                          setAddOpen(true);
                        }}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800"
                      >
                        + Add here
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Add prospect
            </DialogTitle>
            <DialogDescription>
              Anything the research agent has found so far. Stage can be
              updated later by dragging the card.
            </DialogDescription>
          </DialogHeader>
          <ProspectForm
            initialStage={addStage}
            onSaved={() => setAddOpen(false)}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
