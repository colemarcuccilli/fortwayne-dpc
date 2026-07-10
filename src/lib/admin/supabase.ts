// Browser-side Supabase client used by the admin store and the
// public-submission helper. Uses the publishable (anon) key — RLS
// governs table access, and /admin is proxy-gated so the key never
// leaves an authenticated browser context.
//
// Server-side operations that need to bypass RLS should use a service
// role key via a separate helper (not created yet — none of the
// current admin flows need it).

import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** True when the env vars are set. Falsy → fall back to local seed. */
export const SUPABASE_CONFIGURED = Boolean(url) && Boolean(key);

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (!SUPABASE_CONFIGURED) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  if (!cached) {
    cached = createBrowserClient(url, key);
  }
  return cached;
}

// -------------------- row <-> domain mappers --------------------
//
// The DB uses snake_case columns; the app uses camelCase types.
// Everything here is thin transformation only — no business logic.

import type {
  Appointment,
  Availability,
  Customer,
  OutboundMessage,
  Prospect,
  Settings,
  Submission,
  Task,
  Transaction,
} from "./types";

/* -------- Prospect -------- */
export function prospectFromRow(r: Record<string, unknown>): Prospect {
  return {
    id: r.id as string,
    company: r.company as string,
    website: (r.website as string) ?? undefined,
    industry: (r.industry as string) ?? undefined,
    employeeCount: (r.employee_count as number) ?? undefined,
    location: (r.location as string) ?? undefined,
    stage: r.stage as Prospect["stage"],
    fitScore: (r.fit_score as number) ?? undefined,
    fitReason: (r.fit_reason as string) ?? undefined,
    contacts: (r.contacts as Prospect["contacts"]) ?? [],
    activities: (r.activities as Prospect["activities"]) ?? [],
    ownerLabel: (r.owner_label as string) ?? undefined,
    tags: (r.tags as string[]) ?? [],
    estValueUsd: (r.est_value_usd as number) ?? undefined,
    nextFollowUp: (r.next_follow_up as string) ?? undefined,
    sources: (r.sources as string[]) ?? [],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}
export function prospectToRow(p: Prospect) {
  return {
    id: p.id,
    company: p.company,
    website: p.website ?? null,
    industry: p.industry ?? null,
    employee_count: p.employeeCount ?? null,
    location: p.location ?? null,
    stage: p.stage,
    fit_score: p.fitScore ?? null,
    fit_reason: p.fitReason ?? null,
    contacts: p.contacts,
    activities: p.activities,
    owner_label: p.ownerLabel ?? null,
    tags: p.tags,
    est_value_usd: p.estValueUsd ?? null,
    next_follow_up: p.nextFollowUp ?? null,
    sources: p.sources ?? [],
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

/* -------- Submission -------- */
export function submissionFromRow(r: Record<string, unknown>): Submission {
  return {
    id: r.id as string,
    type: r.type as Submission["type"],
    name: r.name as string,
    email: (r.email as string) ?? undefined,
    phone: (r.phone as string) ?? undefined,
    subject: (r.subject as string) ?? undefined,
    message: (r.message as string) ?? undefined,
    meta: (r.meta as Submission["meta"]) ?? undefined,
    read: Boolean(r.read),
    archived: Boolean(r.archived),
    createdAt: r.created_at as string,
  };
}
export function submissionToRow(s: Submission) {
  return {
    id: s.id,
    type: s.type,
    name: s.name,
    email: s.email ?? null,
    phone: s.phone ?? null,
    subject: s.subject ?? null,
    message: s.message ?? null,
    meta: s.meta ?? null,
    read: s.read,
    archived: s.archived,
    created_at: s.createdAt,
  };
}

/* -------- Customer -------- */
export function customerFromRow(r: Record<string, unknown>): Customer {
  return {
    id: r.id as string,
    firstName: r.first_name as string,
    lastName: r.last_name as string,
    email: r.email as string,
    phone: r.phone as string,
    dob: (r.dob as string) ?? undefined,
    address: (r.address as string) ?? undefined,
    membership: r.membership as Customer["membership"],
    membershipStart: (r.membership_start as string) ?? undefined,
    employerId: (r.employer_id as string) ?? undefined,
    notes: (r.notes as Customer["notes"]) ?? [],
    createdAt: r.created_at as string,
  };
}
export function customerToRow(c: Customer) {
  return {
    id: c.id,
    first_name: c.firstName,
    last_name: c.lastName,
    email: c.email,
    phone: c.phone,
    dob: c.dob ?? null,
    address: c.address ?? null,
    membership: c.membership,
    membership_start: c.membershipStart ?? null,
    employer_id: c.employerId ?? null,
    notes: c.notes,
    created_at: c.createdAt,
  };
}

/* -------- Appointment -------- */
export function appointmentFromRow(r: Record<string, unknown>): Appointment {
  return {
    id: r.id as string,
    customerId: (r.customer_id as string) ?? undefined,
    customerName: r.customer_name as string,
    type: r.type as Appointment["type"],
    status: r.status as Appointment["status"],
    startsAt: r.starts_at as string,
    endsAt: r.ends_at as string,
    location: r.location as Appointment["location"],
    notes: (r.notes as string) ?? undefined,
    requiresIntake: Boolean(r.requires_intake),
    createdAt: r.created_at as string,
  };
}
export function appointmentToRow(a: Appointment) {
  return {
    id: a.id,
    customer_id: a.customerId ?? null,
    customer_name: a.customerName,
    type: a.type,
    status: a.status,
    starts_at: a.startsAt,
    ends_at: a.endsAt,
    location: a.location,
    notes: a.notes ?? null,
    requires_intake: a.requiresIntake,
    created_at: a.createdAt,
  };
}

/* -------- Transaction -------- */
export function transactionFromRow(r: Record<string, unknown>): Transaction {
  return {
    id: r.id as string,
    customerId: (r.customer_id as string) ?? undefined,
    customerName: (r.customer_name as string) ?? undefined,
    kind: r.kind as Transaction["kind"],
    amount: r.amount as number,
    currency: "USD",
    description: (r.description as string) ?? undefined,
    posRef: (r.pos_ref as string) ?? undefined,
    occurredAt: r.occurred_at as string,
  };
}
export function transactionToRow(t: Transaction) {
  return {
    id: t.id,
    customer_id: t.customerId ?? null,
    customer_name: t.customerName ?? null,
    kind: t.kind,
    amount: t.amount,
    currency: t.currency,
    description: t.description ?? null,
    pos_ref: t.posRef ?? null,
    occurred_at: t.occurredAt,
  };
}

/* -------- Task -------- */
export function taskFromRow(r: Record<string, unknown>): Task {
  return {
    id: r.id as string,
    title: r.title as string,
    detail: (r.detail as string) ?? undefined,
    priority: r.priority as Task["priority"],
    done: Boolean(r.done),
    linkedProspectId: (r.linked_prospect_id as string) ?? undefined,
    linkedCustomerId: (r.linked_customer_id as string) ?? undefined,
    dueAt: (r.due_at as string) ?? undefined,
    createdAt: r.created_at as string,
  };
}
export function taskToRow(t: Task) {
  return {
    id: t.id,
    title: t.title,
    detail: t.detail ?? null,
    priority: t.priority,
    done: t.done,
    linked_prospect_id: t.linkedProspectId ?? null,
    linked_customer_id: t.linkedCustomerId ?? null,
    due_at: t.dueAt ?? null,
    created_at: t.createdAt,
  };
}

/* -------- Message -------- */
export function messageFromRow(r: Record<string, unknown>): OutboundMessage {
  return {
    id: r.id as string,
    channel: r.channel as OutboundMessage["channel"],
    to: r.to_addr as string,
    toName: (r.to_name as string) ?? undefined,
    subject: (r.subject as string) ?? undefined,
    body: r.body as string,
    status: r.status as OutboundMessage["status"],
    createdAt: r.created_at as string,
    sentAt: (r.sent_at as string) ?? undefined,
  };
}
export function messageToRow(m: OutboundMessage) {
  return {
    id: m.id,
    channel: m.channel,
    to_addr: m.to,
    to_name: m.toName ?? null,
    subject: m.subject ?? null,
    body: m.body,
    status: m.status,
    created_at: m.createdAt,
    sent_at: m.sentAt ?? null,
  };
}

/* -------- Availability + Settings (singletons) -------- */
export function availabilityFromRow(r: Record<string, unknown>): Availability {
  return {
    weekly: (r.weekly as Availability["weekly"]) ?? [],
    blocks: (r.blocks as Availability["blocks"]) ?? [],
    bufferMinutes: (r.buffer_minutes as number) ?? 15,
    virtualEnabled: Boolean(r.virtual_enabled),
  };
}
export function availabilityToRow(a: Availability) {
  return {
    id: "singleton",
    weekly: a.weekly,
    blocks: a.blocks,
    buffer_minutes: a.bufferMinutes,
    virtual_enabled: a.virtualEnabled,
    updated_at: new Date().toISOString(),
  };
}

export function settingsFromRow(r: Record<string, unknown>): Settings {
  return {
    practiceName: r.practice_name as string,
    contactEmail: r.contact_email as string,
    contactPhone: r.contact_phone as string,
    address: r.address as string,
    emailNotifications: Boolean(r.email_notifications),
    smsNotifications: Boolean(r.sms_notifications),
    brandColor: r.brand_color as string,
  };
}
export function settingsToRow(s: Settings) {
  return {
    id: "singleton",
    practice_name: s.practiceName,
    contact_email: s.contactEmail,
    contact_phone: s.contactPhone,
    address: s.address,
    email_notifications: s.emailNotifications,
    sms_notifications: s.smsNotifications,
    brand_color: s.brandColor,
    updated_at: new Date().toISOString(),
  };
}
