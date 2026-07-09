"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
  subWeeks,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/lib/admin/store";
import {
  APPT_STATUS,
  APPT_TYPE_LABEL,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/admin/types";
import { formatDate, formatTime } from "@/lib/admin/format";
import { AppointmentForm } from "@/components/admin/appointment-form";
import { cn } from "@/lib/utils";

type View = "week" | "list";

const TYPE_COLORS: Record<string, string> = {
  new_patient: "bg-emerald-100 text-emerald-800 border-emerald-200",
  follow_up: "bg-slate-100 text-slate-800 border-slate-200",
  annual_wellness: "bg-blue-100 text-blue-800 border-blue-200",
  weight_loss: "bg-orange-100 text-orange-800 border-orange-200",
  aesthetics: "bg-pink-100 text-pink-800 border-pink-200",
  business_meeting: "bg-violet-100 text-violet-800 border-violet-200",
  employer_pilot: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  checked_in: "Checked in",
  completed: "Completed",
  no_show: "No show",
  cancelled: "Cancelled",
};

export default function AppointmentsPage() {
  const { state, dispatch } = useAdmin();
  const [view, setView] = useState<View>("week");
  const [cursor, setCursor] = useState(new Date());
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [defaultStart, setDefaultStart] = useState<Date | undefined>();

  const weekStart = startOfWeek(cursor, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(cursor, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const sortedAppts = useMemo(
    () =>
      [...state.appointments].sort(
        (a, b) =>
          parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
      ),
    [state.appointments],
  );

  const weekAppts = useMemo(
    () =>
      sortedAppts.filter((a) => {
        const s = parseISO(a.startsAt);
        return s >= weekStart && s <= weekEnd;
      }),
    [sortedAppts, weekStart, weekEnd],
  );

  function updateStatus(appt: Appointment, status: AppointmentStatus) {
    dispatch({ type: "appt_update", id: appt.id, patch: { status } });
    setEditing({ ...appt, status });
  }

  function deleteAppt(id: string) {
    if (!confirm("Delete this appointment?")) return;
    dispatch({ type: "appt_delete", id });
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Appointments"
        subtitle="Calendar and list of scheduled visits. Includes business meetings that don't require intake."
        actions={
          <>
            <Tabs value={view} onValueChange={(v) => setView(v as View)}>
              <TabsList>
                <TabsTrigger value="week">
                  <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                  Week
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="mr-1 h-3.5 w-3.5" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={() => {
                setDefaultStart(new Date());
                setAddOpen(true);
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              New
            </Button>
          </>
        }
      />

      {view === "week" && (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
              </div>
              <div className="text-xs text-slate-500">
                {weekAppts.length} appointments this week
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCursor(subWeeks(cursor, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCursor(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCursor(addWeeks(cursor, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-slate-200 sm:grid-cols-7">
            {days.map((day) => {
              const isToday = isSameDay(day, new Date());
              const dayAppts = weekAppts.filter((a) =>
                isSameDay(parseISO(a.startsAt), day),
              );
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[140px] bg-white p-2.5",
                    isToday && "bg-slate-50",
                  )}
                >
                  <div className="mb-2 flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {format(day, "EEE")}
                      </div>
                      <div
                        className={cn(
                          "font-mono text-lg font-semibold tabular-nums",
                          isToday ? "text-brand" : "text-slate-900",
                        )}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const d = new Date(day);
                        d.setHours(10, 0, 0, 0);
                        setDefaultStart(d);
                        setAddOpen(true);
                      }}
                      aria-label="Add appointment"
                      className="text-slate-400 hover:text-slate-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {dayAppts.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setEditing(a)}
                        className={cn(
                          "block w-full rounded-md border px-2 py-1.5 text-left text-[11px] transition-opacity hover:opacity-80",
                          TYPE_COLORS[a.type] ??
                            "bg-slate-100 text-slate-800 border-slate-200",
                          a.status !== "scheduled" && "opacity-60",
                        )}
                      >
                        <div className="font-mono font-semibold tabular-nums">
                          {formatTime(a.startsAt)}
                        </div>
                        <div className="truncate font-medium">
                          {a.customerName}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="rounded-2xl border border-slate-200 bg-white">
          {sortedAppts.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={CalendarIcon} title="No appointments yet" />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {sortedAppts.map((a) => (
                <li key={a.id}>
                  <button
                    onClick={() => setEditing(a)}
                    className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="w-12 shrink-0">
                      <div className="text-[10px] font-semibold uppercase text-slate-500">
                        {formatDate(a.startsAt, "EEE")}
                      </div>
                      <div className="font-mono text-lg font-semibold text-slate-900">
                        {formatDate(a.startsAt, "MMM d")}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {a.customerName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {APPT_TYPE_LABEL[a.type]} · {formatTime(a.startsAt)}{" "}
                        · {a.location === "virtual" ? "Virtual" : "In-office"}
                      </div>
                    </div>
                    <div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                          a.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : a.status === "cancelled" || a.status === "no_show"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-700",
                        )}
                      >
                        {STATUS_LABEL[a.status]}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add new */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            defaultStart={defaultStart}
            onSaved={() => setAddOpen(false)}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment</DialogTitle>
          </DialogHeader>
          {editing && (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
                <Select
                  value={editing.status}
                  onValueChange={(v) =>
                    updateStatus(editing, v as AppointmentStatus)
                  }
                >
                  <SelectTrigger className="h-8 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPT_STATUS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAppt(editing.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <AppointmentForm
                editing={editing}
                onSaved={() => setEditing(null)}
                onCancel={() => setEditing(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
