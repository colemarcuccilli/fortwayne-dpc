import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Calendar,
  CreditCard,
  FileText,
  Phone,
  Plus,
} from "lucide-react";
import { PRACTICE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Your portal",
};

// Demo data — swap for the signed-in member's real records once membership
// DB is wired. Read from a session helper on the server.
const DEMO_APPTS = [
  {
    id: "a1",
    typeLabel: "Annual wellness",
    when: "Tue, May 19 · 10:00 AM",
    location: "In office",
  },
  {
    id: "a2",
    typeLabel: "Follow-up",
    when: "Mon, June 15 · 2:30 PM",
    location: "Virtual",
  },
];

export default function PortalHomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-6 text-brand-foreground md:p-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-foreground/70">
          Welcome back
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          You&rsquo;re all set.
        </h1>
        <p className="mt-2 max-w-lg text-sm text-brand-foreground/85">
          Book, reschedule, or cancel appointments — and see your membership
          details in one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/portal/appointments/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand-dark hover:bg-white/90"
          >
            <Plus className="h-4 w-4" />
            Book appointment
          </Link>
          <a
            href={PRACTICE.phoneHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
            {PRACTICE.phone}
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Upcoming appointments
              </h2>
              <p className="text-xs text-slate-500">
                {DEMO_APPTS.length} scheduled
              </p>
            </div>
            <Link
              href="/portal/appointments"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {DEMO_APPTS.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    {a.typeLabel}
                  </div>
                  <div className="text-xs text-slate-500">
                    {a.when} · {a.location}
                  </div>
                </div>
                <Link
                  href={`/portal/appointments`}
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Manage
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Membership</h2>
            <div className="mt-3 rounded-xl bg-slate-50 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Current plan
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                Family plan
              </div>
              <div className="mt-1 font-mono text-xs text-slate-600">
                $200 / month · Active since Feb 2026
              </div>
            </div>
            <Link
              href="/membership"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              View plan details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Actions</h2>
            <div className="mt-3 space-y-1.5">
              <PortalAction icon={FileText} label="Patient intake form" href="/patient-form" />
              <PortalAction icon={CreditCard} label="Update billing" href="#" />
              <PortalAction icon={Phone} label="Contact the office" href="/contact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalAction({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
    >
      <Icon className="h-4 w-4 text-slate-500" />
      <span className="flex-1">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
    </Link>
  );
}
