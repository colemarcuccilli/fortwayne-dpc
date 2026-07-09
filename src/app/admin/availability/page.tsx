"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdmin } from "@/lib/admin/store";
import type { Availability, DateBlock } from "@/lib/admin/types";
import { nanoid } from "nanoid";
import { Trash2, Plus } from "lucide-react";
import { formatDate } from "@/lib/admin/format";

const DAYS = [
  { i: 1, label: "Mon" },
  { i: 2, label: "Tue" },
  { i: 3, label: "Wed" },
  { i: 4, label: "Thu" },
  { i: 5, label: "Fri" },
  { i: 6, label: "Sat" },
  { i: 0, label: "Sun" },
] as const;

export default function AvailabilityPage() {
  const { state, dispatch } = useAdmin();
  const [draft, setDraft] = useState<Availability>(state.availability);
  const [dirty, setDirty] = useState(false);

  function updateWeekly(weekday: number, patch: Partial<Availability["weekly"][number]>) {
    setDraft((d) => ({
      ...d,
      weekly: d.weekly.map((w) =>
        w.weekday === weekday ? { ...w, ...patch } : w,
      ),
    }));
    setDirty(true);
  }

  function addBlock() {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    setDraft((d) => ({
      ...d,
      blocks: [{ id: `b_${nanoid(6)}`, date: iso, reason: "" }, ...d.blocks],
    }));
    setDirty(true);
  }
  function updateBlock(id: string, patch: Partial<DateBlock>) {
    setDraft((d) => ({
      ...d,
      blocks: d.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
    setDirty(true);
  }
  function removeBlock(id: string) {
    setDraft((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }));
    setDirty(true);
  }

  function save() {
    dispatch({ type: "availability_set", availability: draft });
    setDirty(false);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Availability"
        subtitle="Set the weekly hours patients can book, buffer times between appointments, and block specific dates."
        actions={
          <Button onClick={save} disabled={!dirty}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Weekly hours</h2>
          <p className="mt-1 text-xs text-slate-500">
            Toggle days on or off, then set open and close times.
          </p>
          <div className="mt-4 space-y-2">
            {DAYS.map((d) => {
              const day = draft.weekly.find((w) => w.weekday === d.i)!;
              return (
                <div
                  key={d.i}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <label className="flex w-20 items-center gap-2 text-sm">
                    <Checkbox
                      checked={day.enabled}
                      onCheckedChange={(v) =>
                        updateWeekly(d.i, { enabled: Boolean(v) })
                      }
                    />
                    <span className="font-medium">{d.label}</span>
                  </label>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="time"
                      value={day.open}
                      onChange={(e) =>
                        updateWeekly(d.i, { open: e.target.value })
                      }
                      disabled={!day.enabled}
                      className="w-32"
                    />
                    <span className="text-slate-400">–</span>
                    <Input
                      type="time"
                      value={day.close}
                      onChange={(e) =>
                        updateWeekly(d.i, { close: e.target.value })
                      }
                      disabled={!day.enabled}
                      className="w-32"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Settings</h2>
            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="buffer">Buffer between appts (min)</Label>
                <Input
                  id="buffer"
                  type="number"
                  min={0}
                  step={5}
                  value={draft.bufferMinutes}
                  onChange={(e) => {
                    setDraft((d) => ({ ...d, bufferMinutes: Number(e.target.value) }));
                    setDirty(true);
                  }}
                />
              </div>
              <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <Checkbox
                  checked={draft.virtualEnabled}
                  onCheckedChange={(v) => {
                    setDraft((d) => ({ ...d, virtualEnabled: Boolean(v) }));
                    setDirty(true);
                  }}
                  id="virtual"
                />
                <div>
                  <div className="text-sm font-medium">
                    Allow virtual bookings
                  </div>
                  <div className="text-xs text-slate-600">
                    Patients can pick virtual or in-office when scheduling.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Blocked dates
                </h2>
                <p className="text-xs text-slate-500">
                  Days you&rsquo;re out or booked internally.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={addBlock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {draft.blocks.length === 0 ? (
              <p className="text-xs text-slate-500">No blocked dates.</p>
            ) : (
              <ul className="space-y-2">
                {draft.blocks.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={b.date}
                        onChange={(e) =>
                          updateBlock(b.id, { date: e.target.value })
                        }
                        className="w-36"
                      />
                      <Input
                        placeholder="Reason"
                        value={b.reason}
                        onChange={(e) =>
                          updateBlock(b.id, { reason: e.target.value })
                        }
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeBlock(b.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400">
                      {formatDate(b.date, "EEEE, MMMM d")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
