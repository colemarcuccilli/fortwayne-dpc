// SERVER-ONLY Supabase access.
//
// This module uses the Supabase SERVICE-ROLE key, which bypasses RLS and
// must never reach the browser. It is imported only by API route handlers
// under /app/api/**, which are themselves gated by the signed session
// cookie. The browser holds no database credentials at all.
//
// Row<->domain mapping is shared with the (pure) mappers in ./supabase.

// NOTE: server-only module. It is imported exclusively by /app/api/**
// route handlers and reads SUPABASE_SERVICE_ROLE_KEY, which is never
// exposed to the client bundle. Do not import this from a Client
// Component or any "use client" module.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SEED } from "./seed";
import type { AdminState } from "./types";
import {
  appointmentFromRow,
  appointmentToRow,
  availabilityFromRow,
  availabilityToRow,
  customerFromRow,
  customerToRow,
  messageFromRow,
  messageToRow,
  prospectFromRow,
  prospectToRow,
  settingsFromRow,
  settingsToRow,
  submissionFromRow,
  submissionToRow,
  taskFromRow,
  taskToRow,
  transactionFromRow,
  transactionToRow,
} from "./supabase";

const url =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True only when the server has the service-role key. */
export const SERVICE_CONFIGURED = Boolean(url) && Boolean(serviceKey);

let cached: SupabaseClient | null = null;

export function getServiceSupabase(): SupabaseClient {
  if (!SERVICE_CONFIGURED) {
    throw new Error(
      "Server Supabase is not configured. Set SUPABASE_SERVICE_ROLE_KEY (and SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL).",
    );
  }
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

// -------------------- mutation registry --------------------
//
// Each writable table maps a camelCase domain entity to its snake_case
// row. This doubles as an allow-list: only these tables can be written,
// and toRow() only copies known columns, so a malicious payload can't
// smuggle extra fields in.

/* eslint-disable @typescript-eslint/no-explicit-any */
const TO_ROW: Record<string, (entity: any) => Record<string, unknown>> = {
  prospects: prospectToRow,
  submissions: submissionToRow,
  customers: customerToRow,
  appointments: appointmentToRow,
  transactions: transactionToRow,
  tasks: taskToRow,
  messages: messageToRow,
  availability: availabilityToRow,
  settings: settingsToRow,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export type MutationOp = "upsert" | "delete";
export interface Mutation {
  table: string;
  op: MutationOp;
  row?: unknown;
  id?: string;
}

export function isWritableTable(table: string): boolean {
  return Object.prototype.hasOwnProperty.call(TO_ROW, table);
}

/** Apply one whitelisted mutation with the service-role client. */
export async function applyMutation(m: Mutation): Promise<void> {
  if (!isWritableTable(m.table)) {
    throw new Error(`Table not writable: ${m.table}`);
  }
  const supabase = getServiceSupabase();
  if (m.op === "delete") {
    if (!m.id) throw new Error("delete requires id");
    const { error } = await supabase.from(m.table).delete().eq("id", m.id);
    if (error) throw error;
    return;
  }
  // upsert
  if (m.row == null) throw new Error("upsert requires row");
  const rowData = TO_ROW[m.table](m.row);
  const { error } = await supabase.from(m.table).upsert(rowData);
  if (error) throw error;
}

/** Delete every CRM record across all writable tables. */
export async function clearAllData(): Promise<void> {
  const supabase = getServiceSupabase();
  const tables = [
    "prospects",
    "submissions",
    "customers",
    "appointments",
    "transactions",
    "tasks",
    "messages",
  ];
  await Promise.all(
    tables.map((t) => supabase.from(t).delete().neq("id", "")),
  );
}

// -------------------- reads --------------------

/** Full admin state, read server-side. Falls back to SEED singletons. */
export async function loadAdminState(): Promise<AdminState> {
  const supabase = getServiceSupabase();
  const [
    prospects,
    submissions,
    customers,
    appointments,
    transactions,
    tasks,
    messages,
    availability,
    settings,
  ] = await Promise.all([
    supabase.from("prospects").select("*").order("updated_at", { ascending: false }),
    supabase.from("submissions").select("*").order("created_at", { ascending: false }),
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("appointments").select("*").order("starts_at", { ascending: true }),
    supabase.from("transactions").select("*").order("occurred_at", { ascending: false }),
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("messages").select("*").order("created_at", { ascending: false }),
    supabase.from("availability").select("*").eq("id", "singleton").maybeSingle(),
    supabase.from("settings").select("*").eq("id", "singleton").maybeSingle(),
  ]);

  return {
    prospects: (prospects.data ?? []).map(prospectFromRow),
    submissions: (submissions.data ?? []).map(submissionFromRow),
    customers: (customers.data ?? []).map(customerFromRow),
    appointments: (appointments.data ?? []).map(appointmentFromRow),
    transactions: (transactions.data ?? []).map(transactionFromRow),
    tasks: (tasks.data ?? []).map(taskFromRow),
    messages: (messages.data ?? []).map(messageFromRow),
    availability: availability.data
      ? availabilityFromRow(availability.data)
      : SEED.availability,
    settings: settings.data ? settingsFromRow(settings.data) : SEED.settings,
  };
}

/** Prospects only — for the scoped research console. */
export async function loadProspects(limit = 50) {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("prospects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map(prospectFromRow);
}

/** Insert a single public form submission (contact / patient / employer). */
export async function insertSubmission(row: unknown): Promise<void> {
  const supabase = getServiceSupabase();
  const rowData = submissionToRow(row as Parameters<typeof submissionToRow>[0]);
  const { error } = await supabase.from("submissions").insert(rowData);
  if (error) throw error;
}

/** Insert a single prospect (research console). */
export async function insertProspect(row: unknown): Promise<void> {
  const supabase = getServiceSupabase();
  const rowData = prospectToRow(row as Parameters<typeof prospectToRow>[0]);
  const { error } = await supabase.from("prospects").insert(rowData);
  if (error) throw error;
}
