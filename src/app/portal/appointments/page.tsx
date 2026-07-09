import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Your appointments" };

const APPTS = [
  { id: "a1", type: "Annual wellness", when: "Tue, May 19 · 10:00 AM", location: "In office" },
  { id: "a2", type: "Follow-up", when: "Mon, June 15 · 2:30 PM", location: "Virtual" },
  { id: "a3", type: "Weight-loss check-in", when: "Thu, July 3 · 11:00 AM", location: "In office" },
];

export default function PortalAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Your appointments
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage upcoming visits or book a new one.
          </p>
        </div>
        <Link
          href="/portal/appointments/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90"
        >
          <Plus className="h-4 w-4" />
          Book appointment
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-100">
          {APPTS.map((a) => (
            <li key={a.id} className="flex items-center gap-4 px-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  {a.type}
                </div>
                <div className="text-xs text-slate-500">
                  {a.when} · {a.location}
                </div>
              </div>
              <div className="flex gap-1.5">
                <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">
                  Reschedule
                </button>
                <button className="rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-rose-700 hover:bg-rose-50">
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
