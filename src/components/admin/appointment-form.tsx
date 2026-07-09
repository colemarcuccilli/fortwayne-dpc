"use client";

import { useState } from "react";
import { addMinutes, format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/lib/admin/store";
import {
  APPT_TYPES,
  APPT_TYPE_LABEL,
  type Appointment,
  type AppointmentType,
} from "@/lib/admin/types";

interface Props {
  onSaved: () => void;
  onCancel?: () => void;
  editing?: Appointment;
  defaultStart?: Date;
}

export function AppointmentForm({ onSaved, onCancel, editing, defaultStart }: Props) {
  const { state, dispatch } = useAdmin();

  const [customerId, setCustomerId] = useState(editing?.customerId ?? "");
  const [customerName, setCustomerName] = useState(editing?.customerName ?? "");
  const [type, setType] = useState<AppointmentType>(editing?.type ?? "follow_up");
  const [date, setDate] = useState(
    editing
      ? format(new Date(editing.startsAt), "yyyy-MM-dd")
      : format(defaultStart ?? new Date(), "yyyy-MM-dd"),
  );
  const [time, setTime] = useState(
    editing
      ? format(new Date(editing.startsAt), "HH:mm")
      : format(defaultStart ?? new Date(), "HH:mm"),
  );
  const [durationMin, setDurationMin] = useState(() => {
    if (editing) {
      const diff =
        (new Date(editing.endsAt).getTime() - new Date(editing.startsAt).getTime()) /
        60000;
      return String(Math.round(diff));
    }
    return "45";
  });
  const [location, setLocation] = useState<Appointment["location"]>(
    editing?.location ?? "in_office",
  );
  const [requiresIntake, setRequiresIntake] = useState(
    editing?.requiresIntake ?? false,
  );
  const [notes, setNotes] = useState(editing?.notes ?? "");

  function pickCustomer(id: string) {
    setCustomerId(id);
    const c = state.customers.find((c) => c.id === id);
    if (c) setCustomerName(`${c.firstName} ${c.lastName}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const startsAt = new Date(`${date}T${time}:00`);
    const endsAt = addMinutes(startsAt, Number(durationMin));
    const payload: Omit<Appointment, "id" | "createdAt"> = {
      customerId: customerId || undefined,
      customerName: customerName || "Unnamed",
      type,
      status: editing?.status ?? "scheduled",
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      location,
      requiresIntake,
      notes: notes || undefined,
    };
    if (editing) {
      dispatch({ type: "appt_update", id: editing.id, patch: payload });
    } else {
      dispatch({ type: "appt_add", data: payload });
    }
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="appt-type">Appointment type</Label>
          <Select value={type} onValueChange={(v) => {
            setType(v as AppointmentType);
            if (v === "business_meeting" || v === "employer_pilot") {
              setRequiresIntake(false);
            } else if (v === "new_patient") {
              setRequiresIntake(true);
            }
          }}>
            <SelectTrigger id="appt-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APPT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {APPT_TYPE_LABEL[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-select">Existing customer</Label>
          <Select value={customerId || "_none"} onValueChange={(v) => (v === "_none" ? setCustomerId("") : pickCustomer(v))}>
            <SelectTrigger id="customer-select">
              <SelectValue placeholder="— None / walk-in —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">— None / walk-in —</SelectItem>
              {state.customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-name">Display name</Label>
          <Input
            id="customer-name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Marcus Reilly"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appt-date">Date</Label>
          <Input
            id="appt-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appt-time">Time</Label>
          <Input
            id="appt-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appt-duration">Duration (min)</Label>
          <Input
            id="appt-duration"
            type="number"
            step={15}
            min={15}
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appt-location">Location</Label>
          <Select value={location} onValueChange={(v) => setLocation(v as Appointment["location"])}>
            <SelectTrigger id="appt-location">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_office">In office</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <Checkbox
          checked={requiresIntake}
          onCheckedChange={(v) => setRequiresIntake(Boolean(v))}
          id="requires-intake"
        />
        <div>
          <span className="font-medium">Requires new-patient intake</span>
          <div className="mt-0.5 text-xs text-slate-600">
            Turn off for business meetings, employer pilots, or existing patients.
          </div>
        </div>
      </label>

      <div className="space-y-2">
        <Label htmlFor="appt-notes">Notes</Label>
        <Textarea
          id="appt-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{editing ? "Save changes" : "Add appointment"}</Button>
      </div>
    </form>
  );
}
