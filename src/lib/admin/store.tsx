"use client";

// Admin state store.
//
// The reducer + useAdmin() API is unchanged. What differs from the
// first draft: instead of persisting to localStorage, we now hydrate
// from Supabase on mount and mirror every mutation as a fire-and-forget
// upsert / delete against the corresponding table.
//
// If Supabase is not configured (SUPABASE_CONFIGURED is false), we
// fall back to the local SEED and everything still works — this keeps
// the demo functional even on a preview URL without env vars set.

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
import {
  SUPABASE_CONFIGURED,
  appointmentFromRow,
  appointmentToRow,
  availabilityFromRow,
  availabilityToRow,
  customerFromRow,
  customerToRow,
  getSupabase,
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

/**
 * Fire-and-forget Supabase mirror of a reducer action. Reads the
 * NEXT state to know what to write. Errors are swallowed to console
 * so a transient network failure never freezes the UI — full
 * refresh on next mount re-syncs.
 */
async function sideEffect(action: Action, nextState: AdminState): Promise<void> {
  if (!SUPABASE_CONFIGURED) return;
  const supabase = getSupabase();
  try {
    switch (action.type) {
      case "hydrate":
      case "reset":
        return; // no writes

      case "prospect_add": {
        const p = nextState.prospects[0];
        await supabase.from("prospects").insert(prospectToRow(p));
        return;
      }
      case "prospect_update":
      case "prospect_add_activity": {
        const p = nextState.prospects.find((p) => p.id === action.id);
        if (p) await supabase.from("prospects").upsert(prospectToRow(p));
        return;
      }
      case "prospect_delete":
        await supabase.from("prospects").delete().eq("id", action.id);
        return;

      case "submission_add": {
        const s = nextState.submissions[0];
        await supabase.from("submissions").insert(submissionToRow(s));
        return;
      }
      case "submission_mark_read":
      case "submission_archive": {
        const s = nextState.submissions.find((s) => s.id === action.id);
        if (s) await supabase.from("submissions").upsert(submissionToRow(s));
        return;
      }

      case "appt_add": {
        const a = nextState.appointments[0];
        await supabase.from("appointments").insert(appointmentToRow(a));
        return;
      }
      case "appt_update": {
        const a = nextState.appointments.find((a) => a.id === action.id);
        if (a) await supabase.from("appointments").upsert(appointmentToRow(a));
        return;
      }
      case "appt_delete":
        await supabase.from("appointments").delete().eq("id", action.id);
        return;

      case "customer_add": {
        const c = nextState.customers[0];
        await supabase.from("customers").insert(customerToRow(c));
        return;
      }
      case "customer_update":
      case "customer_add_note": {
        const c = nextState.customers.find((c) => c.id === action.id);
        if (c) await supabase.from("customers").upsert(customerToRow(c));
        return;
      }
      case "customer_delete":
        await supabase.from("customers").delete().eq("id", action.id);
        return;

      case "txn_add": {
        const t = nextState.transactions[0];
        await supabase.from("transactions").insert(transactionToRow(t));
        return;
      }
      case "txn_delete":
        await supabase.from("transactions").delete().eq("id", action.id);
        return;

      case "task_add": {
        const t = nextState.tasks[0];
        await supabase.from("tasks").insert(taskToRow(t));
        return;
      }
      case "task_update": {
        const t = nextState.tasks.find((t) => t.id === action.id);
        if (t) await supabase.from("tasks").upsert(taskToRow(t));
        return;
      }
      case "task_delete":
        await supabase.from("tasks").delete().eq("id", action.id);
        return;

      case "availability_set":
        await supabase
          .from("availability")
          .upsert(availabilityToRow(nextState.availability));
        return;

      case "settings_update":
        await supabase.from("settings").upsert(settingsToRow(nextState.settings));
        return;

      case "message_add": {
        const m = nextState.messages[0];
        await supabase.from("messages").insert(messageToRow(m));
        return;
      }
      case "message_send": {
        const m = nextState.messages.find((m) => m.id === action.id);
        if (m) await supabase.from("messages").upsert(messageToRow(m));
        return;
      }
      case "message_delete":
        await supabase.from("messages").delete().eq("id", action.id);
        return;
    }
  } catch (err) {
    console.error("[admin/store] Supabase sync failed:", err);
  }
}

// -------------------- hydration --------------------

async function hydrateFromSupabase(): Promise<AdminState> {
  const supabase = getSupabase();
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

// -------------------- context --------------------

interface AdminContextValue {
  state: AdminState;
  dispatch: React.Dispatch<Action>;
  hydrated: boolean;
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

  // Wrap dispatch so every action mirrors to Supabase.
  const dispatch = useCallback<React.Dispatch<Action>>(
    (action) => {
      dispatchRaw(action);
      // Read the ABOUT-TO-BE state to send to sideEffect
      const next = reducer(state, action);
      void sideEffect(action, next);
    },
    [state],
  );

  // Hydrate once on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!SUPABASE_CONFIGURED) {
        setHydrated(true);
        return;
      }
      try {
        const remote = await hydrateFromSupabase();
        if (!cancelled) dispatchRaw({ type: "hydrate", state: remote });
      } catch (err) {
        console.error("[admin/store] hydrate failed:", err);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Permanently wipe every CRM record. No seed is re-inserted.
  const clearAll = useCallback(async () => {
    if (SUPABASE_CONFIGURED) {
      const supabase = getSupabase();
      try {
        await Promise.all([
          supabase.from("prospects").delete().neq("id", ""),
          supabase.from("submissions").delete().neq("id", ""),
          supabase.from("customers").delete().neq("id", ""),
          supabase.from("appointments").delete().neq("id", ""),
          supabase.from("transactions").delete().neq("id", ""),
          supabase.from("tasks").delete().neq("id", ""),
          supabase.from("messages").delete().neq("id", ""),
        ]);
      } catch (err) {
        console.error("[admin/store] clear failed:", err);
      }
    }
    dispatchRaw({ type: "reset" });
  }, []);

  const value = useMemo(
    () => ({ state, dispatch, hydrated, clearAll }),
    [state, dispatch, hydrated, clearAll],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
