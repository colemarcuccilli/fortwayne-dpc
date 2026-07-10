"use client";

import { useState } from "react";
import { X, CloudCheck, HardDrive } from "lucide-react";
import { useAdmin } from "@/lib/admin/store";
import { SUPABASE_CONFIGURED } from "@/lib/admin/supabase";

/**
 * Slim, honest sync-status line. Green when talking to Supabase (real
 * data, synced across devices); amber when falling back to local
 * browser storage. No fake seed data exists, so there's no "reset to
 * seed" — only an explicit, confirmed "clear all data".
 */
export function DemoNotice() {
  const [hidden, setHidden] = useState(false);
  const { clearAll, hydrated } = useAdmin();

  if (hidden) return null;

  const synced = SUPABASE_CONFIGURED;

  async function handleClear() {
    const ok = window.confirm(
      "Permanently delete ALL prospects, leads, and CRM records? This cannot be undone.",
    );
    if (!ok) return;
    const confirmText = window.prompt('Type "DELETE" to confirm.');
    if (confirmText !== "DELETE") return;
    await clearAll();
  }

  return (
    <div
      className={
        synced
          ? "border-b border-slate-200 bg-white px-4 py-1.5 text-xs text-slate-600"
          : "border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-xs text-amber-900"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <span
          className={
            synced
              ? "inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700"
              : "inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800"
          }
        >
          {synced ? <CloudCheck className="h-3 w-3" /> : <HardDrive className="h-3 w-3" />}
          {synced ? "Live" : "Local only"}
        </span>
        <span className="flex-1 text-slate-500">
          {synced
            ? hydrated
              ? "Connected to database. Real data, synced across devices."
              : "Loading…"
            : "Not connected to the database — data is only in this browser."}
        </span>
        <button
          onClick={handleClear}
          className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:border-rose-300 hover:text-rose-700"
        >
          Clear all data
        </button>
        <button
          onClick={() => setHidden(true)}
          aria-label="Dismiss"
          className="text-slate-400 hover:text-slate-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
