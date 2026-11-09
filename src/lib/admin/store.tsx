"use client";

// Admin state store.
//
// The reducer + useAdmin() API is unchanged. Data I/O goes through the
// server API routes under /api/admin/*, which use the service-role key
// and are gated by the signed admin session cookie. The BROWSER HOLDS
// NO DATABASE CREDENTIALS — it only calls same-origin endpoints that
// verify the session before touching the database.
//
//   hydrate  -> GET  /api/admin/state
//   mutate   -> POST /api/admin/mutate   (fire-and-forget mirror)
//   clearAll -> POST /api/admin/clear
//
// On a bare preview without a service key the routes serve SEED / no-op,
// so the demo still functions.

import { nanoid } from "nanoid";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { SEED } from "./seed";
import type {
  AdminState,
  Appointment,
  Availability,
  Customer,
  CustomerNote,
  OutboundMessage,
  Prospect,
  ProspectActivity,
  Settings,
  Submission,
  Task,
  Transaction,
} from "./types";

// -------------------- reducer --------------------

type Action =
  | { type: "hydrate"; state: AdminState }
  | { type: "reset" }
  // prospects
  | {
      type: "prospect_add";
      data: Omit<
        Prospect,
        "id" | "createdAt" | "updatedAt" | "activities" | "contacts" | "tags" | "sources"
      > &
        Partial<Pick<Prospect, "contacts" | "tags" | "sources">>;
    }
  | { type: "prospect_update"; id: string; patch: Partial<Prospect> }
  | { type: "prospect_delete"; id: string }
  | {
      type: "prospect_add_activity";
      id: string;
      activity: Omit<ProspectActivity, "id" | "createdAt">;
    }
  // submissions
  | { type: "submission_add"; data: Omit<Submission, "id" | "createdAt" | "read" | "archived"> }
  | { type: "submission_mark_read"; id: string; read: boolean }
  | { type: "submission_archive"; id: string }
  // appointments
  | { type: "appt_add"; data: Omit<Appointment, "id" | "createdAt"> }
  | { type: "appt_update"; id: string; patch: Partial<Appointment> }
  | { type: "appt_delete"; id: string }
  // customers
  | { type: "customer_add"; data: Omit<Customer, "id" | "createdAt" | "notes"> }
  | { type: "customer_update"; id: string; patch: Partial<Customer> }
  | { type: "customer_delete"; id: string }
  | { type: "customer_add_note"; id: string; note: Omit<CustomerNote, "id" | "createdAt"> }
  // transactions
  | { type: "txn_add"; data: Omit<Transaction, "id"> }
  | { type: "txn_delete"; id: string }
  // tasks
  | { type: "task_add"; data: Omit<Task, "id" | "createdAt" | "done"> }
  | { type: "task_update"; id: string; patch: Partial<Task> }
  | { type: "task_delete"; id: string }
  // availability
  | { type: "availability_set"; availability: Availability }
  // settings
  | { type: "settings_update"; patch: Partial<Settings> }
  // messages
  | { type: "message_add"; data: Omit<OutboundMessage, "id" | "createdAt" | "status"> }
  | { type: "message_send"; id: string }
  | { type: "message_delete"; id: string };

function nowIso() {
  return new Date().toISOString();
}

// The reducer stays PURE — it only updates state. Side effects (Supabase
// writes) live in the sideEffect() function below, which the dispatcher
// wrapper calls after each action.
function reducer(state: AdminState, action: Action): AdminState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "reset":
      return SEED;

    case "prospect_add": {
      const p: Prospect = {
        ...action.data,
        id: `p_${nanoid(8)}`,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        activities: [],
        contacts: action.data.contacts ?? [],
        tags: action.data.tags ?? [],
        sources: action.data.sources ?? [],
      } as Prospect;
      return { ...state, prospects: [p, ...state.prospects] };
    }
    case "prospect_update":
      return {
        ...state,
        prospects: state.prospects.map((p) =>
          p.id === action.id ? { ...p, ...action.patch, updatedAt: nowIso() } : p,
        ),
      };
    case "prospect_delete":
      return {
        ...state,
        prospects: state.prospects.filter((p) => p.id !== action.id),
      };
    case "prospect_add_activity":
      return {
        ...state,
        prospects: state.prospects.map((p) =>
          p.id === action.id
            ? {
                ...p,
                activities: [
                  { id: `a_${nanoid(6)}`, createdAt: nowIso(), ...action.activity },
                  ...p.activities,
                ],
                updatedAt: nowIso(),
              }
            : p,
        ),
      };

    case "submission_add": {
      const s: Submission = {
        id: `s_${nanoid(8)}`,
        createdAt: nowIso(),
        read: false,
        archived: false,
        ...action.data,
      };
      return { ...state, submissions: [s, ...state.submissions] };
    }
    case "submission_mark_read":
      return {
        ...state,
        submissions: state.submissions.map((s) =>
          s.id === action.id ? { ...s, read: action.read } : s,
        ),
      };
    case "submission_archive":
      return {
        ...state,
        submissions: state.submissions.map((s) =>
          s.id === action.id ? { ...s, archived: !s.archived } : s,
        ),
      };

    case "appt_add": {
      const a: Appointment = {
        id: `ap_${nanoid(8)}`,
        createdAt: nowIso(),
        ...action.data,
      };
      return { ...state, appointments: [a, ...state.appointments] };
    }
    case "appt_update":
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.id ? { ...a, ...action.patch } : a,
        ),
      };
    case "appt_delete":
      return {
        ...state,
        appointments: state.appointments.filter((a) => a.id !== action.id),
      };

    case "customer_add": {
      const c: Customer = {
        id: `c_${nanoid(8)}`,
        createdAt: nowIso(),
        notes: [],
        ...action.data,
      };
      return { ...state, customers: [c, ...state.customers] };
    }
    case "customer_update":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.id ? { ...c, ...action.patch } : c,
        ),
      };
    case "customer_delete":
      return {
        ...state,
        customers: state.customers.filter((c) => c.id !== action.id),
      };
    case "customer_add_note":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.id
            ? {
                ...c,
                notes: [
                  { id: `n_${nanoid(6)}`, createdAt: nowIso(), ...action.note },
                  ...c.notes,
                ],
              }
            : c,
        ),
      };

    case "txn_add": {
      const t: Transaction = { id: `t_${nanoid(8)}`, ...action.data };
      return { ...state, transactions: [t, ...state.transactions] };
    }
    case "txn_delete":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.id),
      };

    case "task_add": {
      const t: Task = {
        id: `tk_${nanoid(8)}`,
        createdAt: nowIso(),
        done: false,
        ...action.data,
      };
      return { ...state, tasks: [t, ...state.tasks] };
    }
    case "task_update":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)),
      };
    case "task_delete":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
      };

    case "availability_set":
      return { ...state, availability: action.availability };

    case "settings_update":
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case "message_add": {
      const m: OutboundMessage = {
        id: `m_${nanoid(8)}`,
        createdAt: nowIso(),
        status: "draft",
        ...action.data,
      };
      return { ...state, messages: [m, ...state.messages] };
    }
    case "message_send":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, status: "sent", sentAt: nowIso() } : m,
        ),
      };
    case "message_delete":
      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== action.id),
      };
  }
}

// -------------------- server mirror --------------------
//
// One reducer action maps to at most one whitelisted write. We read the
// NEXT state to know the row to persist, then POST it to /api/admin/mutate.

interface Mutation {
  table: string;
  op: "upsert" | "delete";
  row?: unknown;
  id?: string;
}

function mutationFor(action: Action, next: AdminState): Mutation | null {
  switch (action.type) {
    case "hydrate":
    case "reset":
      return null;

    case "prospect_add":
      return { table: "prospects", op: "upsert", row: next.prospects[0] };
    case "prospect_update":
    case "prospect_add_activity": {
      const p = next.prospects.find((p) => p.id === action.id);
      return p ? { table: "prospects", op: "upsert", row: p } : null;
    }
    case "prospect_delete":
      return { table: "prospects", op: "delete", id: action.id };

    case "submission_add":
      return { table: "submissions", op: "upsert", row: next.submissions[0] };
    case "submission_mark_read":
    case "submission_archive": {
      const s = next.submissions.find((s) => s.id === action.id);
      return s ? { table: "submissions", op: "upsert", row: s } : null;
    }

    case "appt_add":
      return { table: "appointments", op: "upsert", row: next.appointments[0] };
    case "appt_update": {
      const a = next.appointments.find((a) => a.id === action.id);
      return a ? { table: "appointments", op: "upsert", row: a } : null;
    }
    case "appt_delete":
      return { table: "appointments", op: "delete", id: action.id };

    case "customer_add":
      return { table: "customers", op: "upsert", row: next.customers[0] };
    case "customer_update":
    case "customer_add_note": {
      const c = next.customers.find((c) => c.id === action.id);
      return c ? { table: "customers", op: "upsert", row: c } : null;
    }
    case "customer_delete":
      return { table: "customers", op: "delete", id: action.id };

    case "txn_add":
      return { table: "transactions", op: "upsert", row: next.transactions[0] };
    case "txn_delete":
      return { table: "transactions", op: "delete", id: action.id };

    case "task_add":
      return { table: "tasks", op: "upsert", row: next.tasks[0] };
    case "task_update": {
      const t = next.tasks.find((t) => t.id === action.id);
      return t ? { table: "tasks", op: "upsert", row: t } : null;
    }
    case "task_delete":
      return { table: "tasks", op: "delete", id: action.id };

    case "availability_set":
      return { table: "availability", op: "upsert", row: next.availability };
    case "settings_update":
      return { table: "settings", op: "upsert", row: next.settings };

    case "message_add":
      return { table: "messages", op: "upsert", row: next.messages[0] };
    case "message_send": {
      const m = next.messages.find((m) => m.id === action.id);
      return m ? { table: "messages", op: "upsert", row: m } : null;
    }
    case "message_delete":
      return { table: "messages", op: "delete", id: action.id };
  }
}

/**
 * Fire-and-forget server mirror of a reducer action. Errors are logged
 * so a transient failure never freezes the UI — a full refresh on next
 * mount re-syncs from the server.
 */
async function persistMutation(action: Action, next: AdminState): Promise<void> {
  const mutation = mutationFor(action, next);
  if (!mutation) return;
  try {
    await fetch("/api/admin/mutate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mutation),
    });
  } catch (err) {
    console.error("[admin/store] mutate failed:", err);
  }
}

// -------------------- hydration --------------------

async function fetchState(): Promise<AdminState | null> {
  try {
    const res = await fetch("/api/admin/state", { cache: "no-store" });
    if (!res.ok) throw new Error(`state ${res.status}`);
    return (await res.json()) as AdminState;
  } catch (err) {
    console.error("[admin/store] hydrate failed:", err);
    return null;
  }
}

// -------------------- context --------------------

interface AdminContextValue {
  state: AdminState;
  dispatch: React.Dispatch<Action>;
  hydrated: boolean;
  /** True once the server admin API answered — i.e. data is server-backed. */
  synced: boolean;
  /** Permanently deletes every CRM record. There is no seed to fall back to. */
  clearAll: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatchRaw] = useReducer(reducer, SEED);
  const [hydrated, setHydrated] = useReducer(
    (_: boolean, next: boolean) => next,
    false,
  );
  const [synced, setSynced] = useReducer(
    (_: boolean, next: boolean) => next,
    false,
  );

  // Wrap dispatch so every action mirrors to the server.
  const dispatch = useCallback<React.Dispatch<Action>>(
    (action) => {
      dispatchRaw(action);
      // Read the ABOUT-TO-BE state to send to the mirror.
      const next = reducer(state, action);
      void persistMutation(action, next);
    },
    [state],
  );

  // Hydrate once on mount from the server.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await fetchState();
      if (!cancelled && remote) {
        dispatchRaw({ type: "hydrate", state: remote });
        setSynced(true);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Permanently wipe every CRM record. No seed is re-inserted.
  const clearAll = useCallback(async () => {
    try {
      await fetch("/api/admin/clear", { method: "POST" });
    } catch (err) {
      console.error("[admin/store] clear failed:", err);
    }
    dispatchRaw({ type: "reset" });
  }, []);

  const value = useMemo(
    () => ({ state, dispatch, hydrated, synced, clearAll }),
    [state, dispatch, hydrated, synced, clearAll],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
