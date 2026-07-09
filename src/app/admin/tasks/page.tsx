"use client";

import { useState } from "react";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdmin } from "@/lib/admin/store";
import { TASK_PRIORITIES, type TaskPriority } from "@/lib/admin/types";
import { formatDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

const TONE: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-700",
};

export default function TasksPage() {
  const { state, dispatch } = useAdmin();
  const [tab, setTab] = useState<"open" | "done">("open");
  const [addOpen, setAddOpen] = useState(false);

  const list = state.tasks.filter((t) => (tab === "open" ? !t.done : t.done));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Tasks"
        subtitle="Practice to-dos — follow-ups, admin work, reminders."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New task
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "open" | "done")}>
        <TabsList>
          <TabsTrigger value="open">
            Open{" "}
            <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0 font-mono text-[10px]">
              {state.tasks.filter((t) => !t.done).length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
      </Tabs>

      {list.length === 0 ? (
        <EmptyState icon={CheckSquare} title={tab === "open" ? "Nothing to do" : "Nothing done yet"} />
      ) : (
        <ul className="space-y-2">
          {list.map((t) => (
            <li
              key={t.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <Checkbox
                checked={t.done}
                onCheckedChange={(v) =>
                  dispatch({
                    type: "task_update",
                    id: t.id,
                    patch: { done: Boolean(v) },
                  })
                }
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <div className={cn(
                  "text-sm font-semibold",
                  t.done ? "text-slate-400 line-through" : "text-slate-900",
                )}>
                  {t.title}
                </div>
                {t.detail && (
                  <div className={cn(
                    "mt-0.5 text-xs",
                    t.done ? "text-slate-400" : "text-slate-600",
                  )}>
                    {t.detail}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 font-semibold uppercase",
                      TONE[t.priority],
                    )}
                  >
                    {t.priority}
                  </span>
                  {t.dueAt && (
                    <span className="text-slate-500">
                      Due {formatDate(t.dueAt)}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Delete task?"))
                    dispatch({ type: "task_delete", id: t.id });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
          </DialogHeader>
          <TaskForm onSaved={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskForm({ onSaved }: { onSaved: () => void }) {
  const { dispatch } = useAdmin();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueAt, setDueAt] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({
          type: "task_add",
          data: {
            title,
            detail: detail || undefined,
            priority,
            dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
          },
        });
        onSaved();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Call Sarah at FW Metal"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="detail">Detail</Label>
        <Textarea
          id="detail"
          rows={3}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pri">Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger id="pri">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p[0].toUpperCase() + p.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="due">Due date</Label>
          <Input id="due" type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Add task
      </Button>
    </form>
  );
}
