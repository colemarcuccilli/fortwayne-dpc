// Client-side helper the PUBLIC marketing forms use to drop
// submissions into the admin store. This works because the admin
// store persists to localStorage under a well-known key, so any page
// in the same browser can append to it without needing the React
// context. When a real backend is wired, replace this with a fetch()
// call to /api/submissions/*.

import { nanoid } from "nanoid";
import { SEED } from "./seed";
import type { AdminState, Submission, SubmissionType } from "./types";

const STORAGE_KEY = "fwdpc-admin-state-v1";

export function saveSubmissionLocal(
  data: Omit<Submission, "id" | "createdAt" | "read" | "archived">,
): boolean {
  if (typeof window === "undefined") return false;
  let state: AdminState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = raw ? (JSON.parse(raw) as AdminState) : SEED;
  } catch {
    state = SEED;
  }

  const submission: Submission = {
    id: `s_${nanoid(8)}`,
    createdAt: new Date().toISOString(),
    read: false,
    archived: false,
    ...data,
  };

  const next: AdminState = {
    ...state,
    submissions: [submission, ...state.submissions],
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

/** Convenience: label helper for each submission type */
export function submissionTypeLabel(type: SubmissionType): string {
  return type === "contact"
    ? "Contact form"
    : type === "patient"
      ? "Patient intake"
      : "Employer inquiry";
}
