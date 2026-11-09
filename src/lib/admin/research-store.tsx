"use client";

// Scoped store for the research console.
//
// Deliberately narrow: it ONLY reads and writes prospects, and it does so
// through the scoped server routes at /api/research/prospects (admin OR
// research session). The research agent's browser holds no database
// credentials and can reach nothing but prospects — least privilege for
// an autonomous agent.

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
import type { BenefitsStatus, Prospect, ProspectContact } from "./types";

export interface NewProspectInput {
  company: string;
  website?: string;
  industry?: string;
  employeeCount?: number;
  location?: string;
  fitScore?: number;
  fitReason?: string;
  benefitsStatus?: BenefitsStatus;
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
    benefitsStatus: input.benefitsStatus,
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
      try {
        const res = await fetch("/api/research/prospects", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`prospects ${res.status}`);
        const { prospects } = (await res.json()) as { prospects: Prospect[] };
        if (!cancelled) dispatch({ type: "hydrate", prospects: prospects ?? [] });
      } catch (err) {
        console.error("[research-store] hydrate failed:", err);
        if (!cancelled) dispatch({ type: "hydrate", prospects: SEED.prospects });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addProspect = useCallback(async (input: NewProspectInput) => {
    const prospect = buildProspect(input);
    // Optimistic add; the server route persists with the service role.
    dispatch({ type: "add", prospect });
    try {
      const res = await fetch("/api/research/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect }),
      });
      if (!res.ok) throw new Error(`insert ${res.status}`);
    } catch (err) {
      console.error("[research-store] insert failed:", err);
    }
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
