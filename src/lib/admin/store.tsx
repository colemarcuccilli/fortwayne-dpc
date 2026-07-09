"use client";

// Admin state store — React Context wrapping a reducer that persists to
// localStorage on every change. This is the ONLY layer touching storage;
// pages/components dispatch actions or read state via useAdmin().
//
// When Supabase is wired up, swap the reducer for a hook that calls the
// Supabase client. The public API (useAdmin) does not change.

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

const STORAGE_KEY = "fwdpc-admin-state-v1";

// -------------------- reducer --------------------

type Action =
  | { type: "hydrate"; state: AdminState }
  | { type: "reset" }
  // prospects
  | { type: "prospect_add"; data: Omit<Prospect, "id" | "createdAt" | "updatedAt" | "activities" | "contacts" | "tags"> & Partial<Pick<Prospect, "contacts" | "tags">> }
  | { type: "prospect_update"; id: string; patch: Partial<Prospect> }
  | { type: "prospect_delete"; id: string }
  | { type: "prospect_add_activity"; id: string; activity: Omit<ProspectActivity, "id" | "createdAt"> }
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

function reducer(state: AdminState, action: Action): AdminState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "reset":
      return SEED;

    case "prospect_add": {
      const p: Prospect = {
        id: `p_${nanoid(8)}`,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        activities: [],
        contacts: action.data.contacts ?? [],
        tags: action.data.tags ?? [],
        ...action.data,
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

// -------------------- context --------------------

interface AdminContextValue {
  state: AdminState;
  dispatch: React.Dispatch<Action>;
  hydrated: boolean;
  resetToSeed: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function loadFromStorage(): AdminState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminState;
  } catch {
    return null;
  }
}

function saveToStorage(state: AdminState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked — silent
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, SEED);
  const [hydrated, setHydrated] = useReducer(
    (_: boolean, next: boolean) => next,
    false,
  );

  // Hydrate from localStorage on mount, and immediately mark hydrated
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) dispatch({ type: "hydrate", state: stored });
    setHydrated(true);
  }, []);

  // Persist on every change after hydration
  useEffect(() => {
    if (hydrated) saveToStorage(state);
  }, [state, hydrated]);

  const resetToSeed = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  const value = useMemo(
    () => ({ state, dispatch, hydrated, resetToSeed }),
    [state, hydrated, resetToSeed],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
