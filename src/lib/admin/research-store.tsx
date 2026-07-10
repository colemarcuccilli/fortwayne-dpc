"use client";

// Scoped store for the research console.
//
// Deliberately narrow: it ONLY reads and writes the `prospects` table.
// The research agent never loads customers, transactions, appointments,
// or any patient data into its browser — least privilege for an
// autonomous agent.
//
// Falls back to the admin localStorage bucket's prospects array when
// Supabase isn't configured, so the demo still works on a bare preview.

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
import {
  SUPABASE_CONFIGURED,
  getSupabase,
  prospectFromRow,
  prospectToRow,
} from "./supabase";
import type { AdminState, Prospect, ProspectContact } from "./types";

const STORAGE_KEY = "fwdpc-admin-state-v1";

export interface NewProspectInput {
  company: string;
  website?: string;
  industry?: string;
  employeeCount?: number;
  location?: string;
  fitScore?: number;
  fitReason?: string;
  estValueUsd?: number;
  tags: string[];
  sources: string[];
  contacts: ProspectContact[];
  /** Freeform research notes — stored as the first activity entry */
  researchNotes?: string;
}

function buildProspect(input: NewProspectInput): Prospect {
  const now = new Date().toISOString();
  return {
    id: `p_${nanoid(8)}`,
    company: input.company,
    website: input.website || undefined,
    industry: input.industry || undefined,
    employeeCount: input.employeeCount,
    location: input.location || undefined,
    stage: "researched",
    fitScore: input.fitScore,
    fitReason: input.fitReason || undefined,
    contacts: input.contacts,
    activities: input.researchNotes
      ? [
          {
            id: `a_${nanoid(6)}`,
            type: "note",
            body: input.researchNotes,
            actor: "Research agent",
            createdAt: now,
          },
        ]
      : [],
    ownerLabel: "researcher",
    tags: input.tags,
    estValueUsd: input.estValueUsd,
    sources: input.sources,
    createdAt: now,
    updatedAt: now,
  };
}

// -------------------- state --------------------

interface ResearchState {
  prospects: Prospect[];
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; prospects: Prospect[] }
  | { type: "add"; prospect: Prospect };

function reducer(state: ResearchState, action: Action): ResearchState {
  switch (action.type) {
    case "hydrate":
      return { prospects: action.prospects, hydrated: true };
    case "add":
      return { ...state, prospects: [action.prospect, ...state.prospects] };
  }
}

// -------------------- persistence helpers --------------------

function loadLocalProspects(): Prospect[] {
  if (typeof window === "undefined") return SEED.prospects;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED.prospects;
    const state = JSON.parse(raw) as AdminState;
    return (state.prospects ?? []).map((p) => ({ ...p, sources: p.sources ?? [] }));
  } catch {
    return SEED.prospects;
  }
}

function saveLocalProspect(prospect: Prospect) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const state: AdminState = raw ? (JSON.parse(raw) as AdminState) : SEED;
    const next: AdminState = {
      ...state,
      prospects: [prospect, ...(state.prospects ?? [])],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

// -------------------- context --------------------

interface ResearchContextValue {
  prospects: Prospect[];
  hydrated: boolean;
  addProspect: (input: NewProspectInput) => Promise<Prospect>;
}

const ResearchContext = createContext<ResearchContextValue | null>(null);

export function ResearchProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    prospects: [],
    hydrated: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (SUPABASE_CONFIGURED) {
        try {
          const supabase = getSupabase();
          const { data } = await supabase
            .from("prospects")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);
          if (!cancelled)
            dispatch({
              type: "hydrate",
              prospects: (data ?? []).map(prospectFromRow),
            });
          return;
        } catch (err) {
          console.error("[research-store] hydrate failed:", err);
        }
      }
      if (!cancelled)
        dispatch({ type: "hydrate", prospects: loadLocalProspects() });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addProspect = useCallback(async (input: NewProspectInput) => {
    const prospect = buildProspect(input);
    if (SUPABASE_CONFIGURED) {
      try {
        const supabase = getSupabase();
        const { error } = await supabase
          .from("prospects")
          .insert(prospectToRow(prospect));
        if (error) throw error;
      } catch (err) {
        console.error("[research-store] insert failed:", err);
        saveLocalProspect(prospect);
      }
    } else {
      saveLocalProspect(prospect);
    }
    dispatch({ type: "add", prospect });
    return prospect;
  }, []);

  const value = useMemo(
    () => ({
      prospects: state.prospects,
      hydrated: state.hydrated,
      addProspect,
    }),
    [state.prospects, state.hydrated, addProspect],
  );

  return (
    <ResearchContext.Provider value={value}>
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const ctx = useContext(ResearchContext);
  if (!ctx) throw new Error("useResearch must be used inside <ResearchProvider>");
  return ctx;
}
