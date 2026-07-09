// Client-side helper the PUBLIC marketing forms use to drop
// submissions into the admin backend.
//
// When Supabase is configured, submissions are inserted directly into
// the `submissions` table so they show up in /admin/inbox regardless
// of which device or browser the admin is on. When it isn't (dev
// preview without env vars), we fall back to writing the admin
// store's localStorage bucket so the demo still functions.

import { nanoid } from "nanoid";
import { SEED } from "./seed";
import { SUPABASE_CONFIGURED, getSupabase, submissionToRow } from "./supabase";
import type { AdminState, Submission, SubmissionType } from "./types";

const STORAGE_KEY = "fwdpc-admin-state-v1";

export async function saveSubmissionLocal(
  data: Omit<Submission, "id" | "createdAt" | "read" | "archived">,
): Promise<boolean> {
  const submission: Submission = {
    id: `s_${nanoid(8)}`,
    createdAt: new Date().toISOString(),
    read: false,
    archived: false,
    ...data,
  };

  if (SUPABASE_CONFIGURED) {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("submissions")
        .insert(submissionToRow(submission));
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("[public-submission] Supabase insert failed:", err);
      // fall through to local persistence so nothing is lost
    }
  }

  if (typeof window === "undefined") return false;
  let state: AdminState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = raw ? (JSON.parse(raw) as AdminState) : SEED;
  } catch {
    state = SEED;
  }
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
