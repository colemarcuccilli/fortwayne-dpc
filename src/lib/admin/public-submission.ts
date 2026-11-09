// Client-side helper the PUBLIC marketing forms use to drop submissions
// into the admin backend.
//
// Submissions POST to /api/public/submission — a same-origin server route
// that inserts with the service-role key. The browser never touches the
// database directly, so no credential ships in the public bundle. The
// server assigns the authoritative id / timestamps.
//
// If the server call fails we keep a copy in the submitting browser's
// localStorage as a last resort so the data isn't lost outright.

import { nanoid } from "nanoid";
import { SEED } from "./seed";
import type { AdminState, Submission, SubmissionType } from "./types";

const STORAGE_KEY = "fwdpc-admin-state-v1";

export type SubmitOutcome =
  | { ok: true }
  | { ok: false; reason: "captcha" | "rejected" | "network" };

export async function saveSubmissionLocal(
  data: Omit<Submission, "id" | "createdAt" | "read" | "archived">,
  turnstileToken?: string | null,
): Promise<SubmitOutcome> {
  // Primary path: secure server route.
  try {
    const res = await fetch("/api/public/submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, turnstileToken: turnstileToken ?? null }),
    });
    if (res.ok) return { ok: true };

    // The server actively refused it. A local copy would be pointless and
    // reporting success would be a lie, so surface the real reason.
    if (res.status >= 400 && res.status < 500) {
      console.error("[public-submission] rejected:", res.status);
      return { ok: false, reason: res.status === 403 ? "captcha" : "rejected" };
    }
    throw new Error(`submission ${res.status}`);
  } catch (err) {
    console.error("[public-submission] server insert failed:", err);
    // Network / server error: keep a local breadcrumb, but still report
    // failure so the visitor is told to call instead of assuming we got it.
  }

  if (typeof window === "undefined") return { ok: false, reason: "network" };
  const submission: Submission = {
    id: `s_${nanoid(8)}`,
    createdAt: new Date().toISOString(),
    read: false,
    archived: false,
    ...data,
  };
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
  } catch {
    /* storage full or blocked — nothing more we can do */
  }
  return { ok: false, reason: "network" };
}

/** Convenience: label helper for each submission type */
export function submissionTypeLabel(type: SubmissionType): string {
  return type === "contact"
    ? "Contact form"
    : type === "patient"
      ? "Patient intake"
      : "Employer inquiry";
}
