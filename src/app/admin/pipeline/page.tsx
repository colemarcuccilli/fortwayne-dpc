"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Building2,
  Plus,
  LayoutGrid,
  List as ListIcon,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdmin } from "@/lib/admin/store";
import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABEL,
  type PipelineStage,
  type Prospect,
} from "@/lib/admin/types";
import { StageBadge } from "@/components/admin/stage-badge";
import { formatMoney, initials, timeAgo } from "@/lib/admin/format";
import { ProspectForm } from "@/components/admin/prospect-form";
import { cn } from "@/lib/utils";

type View = "board" | "list";

export default function PipelinePage() {
  const { state, dispatch } = useAdmin();
  const [view, setView] = useState<View>("board");
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<"all" | PipelineStage>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [addStage, setAddStage] = useState<PipelineStage>("researched");
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = state.prospects;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.company.toLowerCase().includes(q) ||
          p.industry?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.contacts.some((c) => c.name.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [state.prospects, query]);

  // For board: group by stage. For list: apply stage filter + sort.
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

  const listRows = useMemo(() => {
    const rows =
      stageFilter === "all"
        ? filtered
        : filtered.filter((p) => p.stage === stageFilter);
    return [...rows].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [filtered, stageFilter]);

  const boardStages =
    stageFilter === "all" ? PIPELINE_STAGES : ([stageFilter] as PipelineStage[]);

  function moveStage(id: string, stage: PipelineStage) {
    dispatch({ type: "prospect_update", id, patch: { stage } });
    dispatch({
      type: "prospect_add_activity",
      id,
      activity: { type: "stage_change", body: `Moved to ${PIPELINE_STAGE_LABEL[stage]}` },
    });
  }

  function handleDrop(stage: PipelineStage) {
    if (!draggingId) return;
    moveStage(draggingId, stage);
    setDraggingId(null);
  }

  const isEmpty = filtered.length === 0;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Pipeline"
        subtitle="Businesses to reach out to about DPC for their team."
        actions={
          <Button
            onClick={() => {
              setAddStage("researched");
              setAddOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add prospect
          </Button>
        }
      />

      {/* Controls: view toggle + stage filter + search */}
      <div className="flex flex-wrap items-center gap-2">
        <Tabs value={view} onValueChange={(v) => setView(v as View)}>
          <TabsList>
            <TabsTrigger value="board">
              <LayoutGrid className="mr-1 h-3.5 w-3.5" />
              Board
            </TabsTrigger>
            <TabsTrigger value="list">
              <ListIcon className="mr-1 h-3.5 w-3.5" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={stageFilter}
          onValueChange={(v) => setStageFilter(v as "all" | PipelineStage)}
        >
          <SelectTrigger className="h-9 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {PIPELINE_STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {PIPELINE_STAGE_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="search"
          placeholder="Search company, contact, tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full sm:w-64"
        />

        <span className="ml-auto hidden text-xs text-slate-500 sm:inline">
          {filtered.length} prospect{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={LayoutGrid}
          title={query ? "No matches" : "Pipeline is empty"}
          body={
            query
              ? "Try a different search term."
              : "Add a business you want to reach out to."
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
      ) : view === "board" ? (
        /* ---------- BOARD ---------- */
        <div className="overflow-x-auto pb-3">
          <div className="flex gap-3">
            {boardStages.map((stage) => (
              <div
                key={stage}
                className="flex max-h-[calc(100vh-16rem)] w-72 shrink-0 flex-col rounded-2xl border border-slate-200 bg-slate-100/70"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stage)}
              >
                {/* sticky column header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5">
                  <StageBadge stage={stage} />
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {byStage[stage].length}
                  </span>
                </div>

                {/* internally-scrolling card list */}
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2.5">
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
                            <div className="mt-0.5 truncate text-[11px] text-slate-500">
                              {p.industry}
                              {p.employeeCount ? ` · ${p.employeeCount} emp` : ""}
                            </div>
                          )}
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
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
                            No contact
                          </span>
                        )}
                        {p.estValueUsd ? (
                          <span className="font-mono text-[11px] font-semibold tabular-nums text-slate-700">
                            {formatMoney(p.estValueUsd * 100)}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))}

                  {byStage[stage].length === 0 && (
                    <button
                      onClick={() => {
                        setAddStage(stage);
                        setAddOpen(true);
                      }}
                      className="w-full rounded-lg border border-dashed border-slate-300 px-2 py-3 text-xs font-medium text-slate-500 hover:text-slate-800"
                    >
                      + Add here
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ---------- LIST ---------- */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-4 py-2.5">Company</th>
                  <th className="px-3 py-2.5">Stage</th>
                  <th className="px-3 py-2.5">Contact</th>
                  <th className="px-3 py-2.5 text-right">Emp</th>
                  <th className="px-3 py-2.5 text-right">Fit</th>
                  <th className="px-3 py-2.5 text-right">Value</th>
                  <th className="px-3 py-2.5 text-right">Updated</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listRows.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/admin/pipeline/${p.id}`}
                        className="font-semibold text-slate-900 hover:underline"
                      >
                        {p.company}
                      </Link>
                      {p.industry && (
                        <div className="text-[11px] text-slate-500">
                          {p.industry}
                          {p.location ? ` · ${p.location}` : ""}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <Select
                        value={p.stage}
                        onValueChange={(v) => moveStage(p.id, v as PipelineStage)}
                      >
                        <SelectTrigger className="h-8 w-36 text-xs">
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
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">
                      {p.contacts[0]?.name ?? (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-700">
                      {p.employeeCount ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-700">
                      {p.fitScore != null ? `${p.fitScore}/10` : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-700">
                      {p.estValueUsd ? formatMoney(p.estValueUsd * 100) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right text-[11px] text-slate-400">
                      {timeAgo(p.updatedAt)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Link
                        href={`/admin/pipeline/${p.id}`}
                        className="inline-flex text-slate-400 hover:text-slate-900"
                        aria-label={`Open ${p.company}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {listRows.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-slate-500">
              No prospects in this stage.
            </div>
          )}
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
              Anything found so far. Stage can be changed later from either
              view.
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
